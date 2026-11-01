import { normalizeState } from '@/lib/indiaLocations';

export interface PincodeInfo {
  city: string;
  state: string;
}

/**
 * Pincode -> city + state using India Post's public lookup (api.postalpincode.in).
 * It's a free third-party service, so every failure path returns null and the form
 * simply stays manual. Swap this one function if you later move to your own endpoint.
 */
export async function fetchPincodeInfo(pin: string, signal?: AbortSignal): Promise<PincodeInfo | null> {
  if (!/^\d{6}$/.test(pin)) return null;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, { signal });
    if (!res.ok) return null;
    const data = await res.json();
    const entry = Array.isArray(data) ? data[0] : null;
    const office = entry?.Status === 'Success' ? entry.PostOffice?.[0] : null;
    if (!office) return null;
    const state = normalizeState(office.State);
    const city = String(office.District || office.Block || '').trim();
    return state && city ? { city, state } : null;
  } catch {
    return null; // network error, CORS, abort - all just mean "don't autofill"
  }
}