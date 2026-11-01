// Loads the Google Maps JavaScript API exactly once, and only when asked.
// We call this lazily (when the customer first focuses the address box) so the
// Maps script is never downloaded on pages that don't need it, and so you are
// not billed for page loads that never touch Autocomplete.

declare global {
  interface Window {
    __initGoogleMaps?: () => void;
    gm_authFailure?: () => void;
  }
}

let loadPromise: Promise<void> | null = null;

// ---------------------------------------------------------------------------
// Minimal local types for the parts of the Places (New) API we use.
// Declared here so the project does NOT need the @types/google.maps package.
// ---------------------------------------------------------------------------
export interface GooglePlaceComponent {
  longText?: string | null;
  shortText?: string | null;
  types: string[];
}

export interface GooglePlace {
  addressComponents?: GooglePlaceComponent[] | null;
  fetchFields(request: { fields: string[] }): Promise<unknown>;
}

export interface GooglePlacePrediction {
  text: { text: string };
  mainText?: { text: string } | null;
  secondaryText?: { text: string } | null;
  toPlace(): GooglePlace;
}

export interface GoogleSuggestion {
  placePrediction?: GooglePlacePrediction | null;
}

export interface GooglePlacesLibrary {
  AutocompleteSessionToken: new () => object;
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: {
      input: string;
      sessionToken?: object;
      includedRegionCodes?: string[];
      region?: string;
      language?: string;
    }): Promise<{ suggestions: GoogleSuggestion[] }>;
  };
}

type MapsWindow = { google?: { maps?: { importLibrary?: (name: string) => Promise<unknown> } } };

const isReady = () => typeof (window as unknown as MapsWindow).google?.maps?.importLibrary === 'function';

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Google Maps needs a browser'));
  if (isReady()) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const fail = (message: string) => {
      loadPromise = null; // allow a retry on the next focus
      document.getElementById('google-maps-script')?.remove();
      reject(new Error(message));
    };

    // With loading=async the script's own "load" event fires BEFORE google.maps.importLibrary
    // exists, so we must wait for Google's `callback` instead.
    window.__initGoogleMaps = () => (isReady() ? resolve() : fail('Google Maps loaded but importLibrary is missing'));
    // Google calls this when the key is invalid, billing is off, or the referrer isn't allowed.
    window.gm_authFailure = () =>
      fail('Google Maps rejected the API key (check the key, billing, enabled APIs and referrer restrictions)');

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}` +
      `&loading=async&v=weekly&language=en&region=IN&callback=__initGoogleMaps`;
    script.async = true;
    script.onerror = () => fail('Failed to load the Google Maps script (network or ad-blocker?)');
    document.head.appendChild(script);
  });

  return loadPromise;
}

/** Loads Google Maps (once) and returns the Places library, ready to use. */
export async function loadPlacesLibrary(apiKey: string): Promise<GooglePlacesLibrary> {
  await loadGoogleMaps(apiKey);
  const importLibrary = (window as unknown as MapsWindow).google?.maps?.importLibrary;
  if (typeof importLibrary !== 'function') throw new Error('Google Maps importLibrary is unavailable');
  return (await importLibrary('places')) as GooglePlacesLibrary;
}