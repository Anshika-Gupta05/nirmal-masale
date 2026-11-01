import { normalizeState } from '@/lib/indiaLocations';

/** The bits of google.maps.places.AddressComponent we rely on (keeps this file Google-free and testable). */
export interface PlaceComponent {
  longText?: string | null;
  shortText?: string | null;
  types: string[];
}

export interface ParsedAddress {
  /** Street / locality line (no city, state or pincode - those have their own fields) */
  address: string;
  city: string;
  state: string;
  pincode: string;
}

// Order matters: most specific -> least specific, which is how Indian addresses read.
const LINE_TYPES = [
  'subpremise',
  'premise',
  'street_number',
  'route',
  'neighborhood',
  'sublocality_level_3',
  'sublocality_level_2',
  'sublocality_level_1',
] as const;

const pick = (components: PlaceComponent[], type: string) =>
  components.find((c) => c.types.includes(type))?.longText?.trim() ?? '';

/**
 * Turns Google's address components into the four fields on the checkout form.
 * `fallbackLine` is used for the address when Google gives us no street-level parts
 * (e.g. the customer picked a city or a landmark).
 */
export function parsePlaceComponents(components: PlaceComponent[], fallbackLine = ''): ParsedAddress {
  // In India `locality` is normally the city; the others are fallbacks for smaller towns / UTs.
  const city =
    pick(components, 'locality') ||
    pick(components, 'postal_town') ||
    pick(components, 'administrative_area_level_3') ||
    pick(components, 'administrative_area_level_2');

  const rawState = pick(components, 'administrative_area_level_1');
  const state = normalizeState(rawState) ?? rawState;

  const digits = pick(components, 'postal_code').replace(/\D/g, '');
  const pincode = /^\d{6}$/.test(digits) ? digits : '';

  const seen = new Set<string>();
  const parts: string[] = [];
  for (const type of LINE_TYPES) {
    const value = pick(components, type);
    const key = value.toLowerCase();
    if (!value || key === city.toLowerCase() || seen.has(key)) continue;
    seen.add(key);
    parts.push(value);
  }

  return { address: parts.join(', ') || fallbackLine, city, state, pincode };
}