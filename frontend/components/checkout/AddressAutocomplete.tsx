'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { loadPlacesLibrary, type GooglePlacesLibrary, type GooglePlacePrediction } from '@/lib/googleMaps';
import { parsePlaceComponents, type ParsedAddress } from '@/lib/addressParser';

interface Suggestion {
  prediction: GooglePlacePrediction;
  main: string;
  secondary: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** Fired when the customer picks a suggestion, with the parsed address / city / state / pincode. */
  onPlaceSelected: (parsed: ParsedAddress) => void;
  className?: string;
  rows?: number;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MIN_CHARS = 3;
const DEBOUNCE_MS = 250;

export default function AddressAutocomplete({ value, onChange, onPlaceSelected, className, rows = 3 }: Props) {
  const listId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const placesRef = useRef<GooglePlacesLibrary | null>(null);
  const sessionRef = useRef<object | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const requestIdRef = useRef(0);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [justPicked, setJustPicked] = useState(false);

  // Load Google Maps + the Places library the first time it's needed.
  const ensureLibrary = useCallback(async () => {
    if (placesRef.current) return placesRef.current;
    if (!API_KEY) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set - address autocomplete is disabled.');
      }
      return null;
    }
    try {
      placesRef.current = await loadPlacesLibrary(API_KEY);
      return placesRef.current;
    } catch (err) {
      console.error(err);
      return null; // the form keeps working as plain manual entry
    }
  }, []);

  const fetchSuggestions = useCallback(
    async (input: string) => {
      const places = await ensureLibrary();
      if (!places) return;

      // One session token per "typing -> pick" journey keeps Google billing to a single session.
      sessionRef.current ??= new places.AutocompleteSessionToken();
      const requestId = ++requestIdRef.current;

      try {
        const { suggestions: raw } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionRef.current,
          includedRegionCodes: ['in'],
          region: 'in',
          language: 'en',
        });
        if (requestId !== requestIdRef.current) return; // a newer keystroke already superseded this

        const next: Suggestion[] = [];
        for (const s of raw) {
          const p = s.placePrediction;
          if (!p) continue;
          next.push({
            prediction: p,
            main: p.mainText?.text ?? p.text.text,
            secondary: p.secondaryText?.text ?? '',
          });
        }
        setSuggestions(next);
        setActive(-1);
        setOpen(next.length > 0);
      } catch (err) {
        console.error('Places autocomplete failed', err);
        if (requestId === requestIdRef.current) setOpen(false);
      }
    },
    [ensureLibrary],
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);
    setJustPicked(false);
    clearTimeout(timerRef.current);

    if (text.trim().length < MIN_CHARS) {
      requestIdRef.current++; // invalidate any in-flight request
      setSuggestions([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(() => fetchSuggestions(text.trim()), DEBOUNCE_MS);
  };

  const select = async (s: Suggestion) => {
    clearTimeout(timerRef.current);
    requestIdRef.current++;
    setOpen(false);
    setSuggestions([]);

    try {
      const place = s.prediction.toPlace();
      await place.fetchFields({ fields: ['addressComponents', 'formattedAddress'] });
      const parsed = parsePlaceComponents(place.addressComponents ?? [], s.main);
      onPlaceSelected(parsed);
    } catch (err) {
      console.error('Could not fetch place details', err);
      onChange([s.main, s.secondary].filter(Boolean).join(', ')); // at least keep what they picked
    } finally {
      sessionRef.current = null; // session is over once details are fetched
      setJustPicked(true);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault(); // pick the suggestion instead of inserting a newline
      select(suggestions[active]);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
    }
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          void ensureLibrary(); // warm up so the first keystroke isn't waiting on the script
          if (suggestions.length > 0) setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        className={className}
        rows={rows}
        placeholder="House / flat no., building, street, area"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      />

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 left-0 right-0 mt-1 rounded-xl border border-gold/30 bg-surface-2 shadow-2xl overflow-hidden"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.main}-${s.secondary}-${i}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown (not click) so the textarea's blur doesn't close the list first
              onMouseDown={(e) => {
                e.preventDefault();
                select(s);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer text-sm transition-colors ${
                i === active ? 'bg-gold/15' : ''
              }`}
            >
              <svg className="mt-0.5 shrink-0 text-gold-soft" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span className="min-w-0">
                <span className="block text-ivory truncate">{s.main}</span>
                {s.secondary && <span className="block text-xs text-ivory-muted truncate">{s.secondary}</span>}
              </span>
            </li>
          ))}
          {/* Google requires attribution when suggestions are shown without a map.
              Replace this text with the official "Google Maps" logo asset from Google's branding guidelines. */}
          <li role="presentation" className="px-4 py-2 text-[10px] tracking-wide text-ivory-muted/70 border-t border-gold/15 text-right">
            Powered by Google
          </li>
        </ul>
      )}

      {justPicked && (
        <p className="text-xs text-gold-soft mt-1">Address filled in — add your flat / house number at the start if it&apos;s missing.</p>
      )}
    </div>
  );
}