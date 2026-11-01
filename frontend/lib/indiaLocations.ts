// Static India location data used by the checkout form.
//  - normalizeState(): maps whatever Google / India Post returns to one canonical state name
//  - lookupCity():     "Smart City Fallback" -> state + default pincode for a city typed by hand

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union territories
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
] as const;

const squash = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STATE_BY_KEY = new Map<string, string>(INDIAN_STATES.map((s) => [squash(s), s]));

// Older / alternate spellings that Google or India Post may return.
const STATE_ALIASES: Record<string, string> = {
  'nct of delhi': 'Delhi',
  'new delhi': 'Delhi',
  'national capital territory of delhi': 'Delhi',
  orissa: 'Odisha',
  uttaranchal: 'Uttarakhand',
  pondicherry: 'Puducherry',
  'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'andaman and nicobar': 'Andaman and Nicobar Islands',
  'jammu and kashmir ut': 'Jammu and Kashmir',
};

/** Returns the canonical state name, or null if it isn't a recognised Indian state/UT. */
export function normalizeState(raw?: string | null): string | null {
  if (!raw) return null;
  const key = squash(raw);
  return STATE_BY_KEY.get(key) ?? STATE_ALIASES[key] ?? null;
}

// ---------------------------------------------------------------------------
// City -> state + default pincode
// The pincode is the city's main (GPO / central) code. A city has many pincodes,
// so this is only a starting suggestion and the UI asks the customer to confirm it.
// ---------------------------------------------------------------------------
interface CityInfo {
  state: string;
  pincode: string;
}

const CITY_DATA: Record<string, CityInfo> = {
  // Maharashtra
  'Mumbai': { state: 'Maharashtra', pincode: '400001' },
  'Thane': { state: 'Maharashtra', pincode: '400601' },
  'Navi Mumbai': { state: 'Maharashtra', pincode: '400703' },
  'Pune': { state: 'Maharashtra', pincode: '411001' },
  'Nagpur': { state: 'Maharashtra', pincode: '440001' },
  'Nashik': { state: 'Maharashtra', pincode: '422001' },
  'Chhatrapati Sambhajinagar': { state: 'Maharashtra', pincode: '431001' },
  'Kolhapur': { state: 'Maharashtra', pincode: '416001' },
  'Solapur': { state: 'Maharashtra', pincode: '413001' },
  'Amravati': { state: 'Maharashtra', pincode: '444601' },
  'Akola': { state: 'Maharashtra', pincode: '444001' },
  'Nanded': { state: 'Maharashtra', pincode: '431601' },
  // Delhi NCR
  'Delhi': { state: 'Delhi', pincode: '110001' },
  'New Delhi': { state: 'Delhi', pincode: '110001' },
  'Noida': { state: 'Uttar Pradesh', pincode: '201301' },
  'Ghaziabad': { state: 'Uttar Pradesh', pincode: '201001' },
  'Gurugram': { state: 'Haryana', pincode: '122001' },
  'Faridabad': { state: 'Haryana', pincode: '121001' },
  // Karnataka
  'Bengaluru': { state: 'Karnataka', pincode: '560001' },
  'Mysuru': { state: 'Karnataka', pincode: '570001' },
  'Mangaluru': { state: 'Karnataka', pincode: '575001' },
  'Hubballi': { state: 'Karnataka', pincode: '580020' },
  'Belagavi': { state: 'Karnataka', pincode: '590001' },
  // Tamil Nadu
  'Chennai': { state: 'Tamil Nadu', pincode: '600001' },
  'Coimbatore': { state: 'Tamil Nadu', pincode: '641001' },
  'Madurai': { state: 'Tamil Nadu', pincode: '625001' },
  'Tiruchirappalli': { state: 'Tamil Nadu', pincode: '620001' },
  'Salem': { state: 'Tamil Nadu', pincode: '636001' },
  'Erode': { state: 'Tamil Nadu', pincode: '638001' },
  'Vellore': { state: 'Tamil Nadu', pincode: '632001' },
  'Tirunelveli': { state: 'Tamil Nadu', pincode: '627001' },
  'Thanjavur': { state: 'Tamil Nadu', pincode: '613001' },
  // Telangana / Andhra Pradesh
  'Hyderabad': { state: 'Telangana', pincode: '500001' },
  'Visakhapatnam': { state: 'Andhra Pradesh', pincode: '530001' },
  'Vijayawada': { state: 'Andhra Pradesh', pincode: '520001' },
  'Guntur': { state: 'Andhra Pradesh', pincode: '522001' },
  'Nellore': { state: 'Andhra Pradesh', pincode: '524001' },
  'Tirupati': { state: 'Andhra Pradesh', pincode: '517501' },
  // Kerala
  'Kochi': { state: 'Kerala', pincode: '682001' },
  'Thiruvananthapuram': { state: 'Kerala', pincode: '695001' },
  'Kozhikode': { state: 'Kerala', pincode: '673001' },
  'Thrissur': { state: 'Kerala', pincode: '680001' },
  'Kannur': { state: 'Kerala', pincode: '670001' },
  'Kollam': { state: 'Kerala', pincode: '691001' },
  // Gujarat
  'Ahmedabad': { state: 'Gujarat', pincode: '380001' },
  'Surat': { state: 'Gujarat', pincode: '395001' },
  'Vadodara': { state: 'Gujarat', pincode: '390001' },
  'Rajkot': { state: 'Gujarat', pincode: '360001' },
  // Rajasthan
  'Jaipur': { state: 'Rajasthan', pincode: '302001' },
  'Jodhpur': { state: 'Rajasthan', pincode: '342001' },
  'Udaipur': { state: 'Rajasthan', pincode: '313001' },
  'Kota': { state: 'Rajasthan', pincode: '324001' },
  'Ajmer': { state: 'Rajasthan', pincode: '305001' },
  'Bikaner': { state: 'Rajasthan', pincode: '334001' },
  // Uttar Pradesh
  'Lucknow': { state: 'Uttar Pradesh', pincode: '226001' },
  'Kanpur': { state: 'Uttar Pradesh', pincode: '208001' },
  'Agra': { state: 'Uttar Pradesh', pincode: '282001' },
  'Varanasi': { state: 'Uttar Pradesh', pincode: '221001' },
  'Prayagraj': { state: 'Uttar Pradesh', pincode: '211001' },
  'Meerut': { state: 'Uttar Pradesh', pincode: '250001' },
  'Gorakhpur': { state: 'Uttar Pradesh', pincode: '273001' },
  'Bareilly': { state: 'Uttar Pradesh', pincode: '243001' },
  'Aligarh': { state: 'Uttar Pradesh', pincode: '202001' },
  'Moradabad': { state: 'Uttar Pradesh', pincode: '244001' },
  // Madhya Pradesh / Chhattisgarh
  'Bhopal': { state: 'Madhya Pradesh', pincode: '462001' },
  'Indore': { state: 'Madhya Pradesh', pincode: '452001' },
  'Jabalpur': { state: 'Madhya Pradesh', pincode: '482001' },
  'Gwalior': { state: 'Madhya Pradesh', pincode: '474001' },
  'Ujjain': { state: 'Madhya Pradesh', pincode: '456001' },
  'Raipur': { state: 'Chhattisgarh', pincode: '492001' },
  'Bhilai': { state: 'Chhattisgarh', pincode: '490001' },
  // East
  'Kolkata': { state: 'West Bengal', pincode: '700001' },
  'Siliguri': { state: 'West Bengal', pincode: '734001' },
  'Durgapur': { state: 'West Bengal', pincode: '713201' },
  'Asansol': { state: 'West Bengal', pincode: '713301' },
  'Patna': { state: 'Bihar', pincode: '800001' },
  'Ranchi': { state: 'Jharkhand', pincode: '834001' },
  'Jamshedpur': { state: 'Jharkhand', pincode: '831001' },
  'Dhanbad': { state: 'Jharkhand', pincode: '826001' },
  'Bhubaneswar': { state: 'Odisha', pincode: '751001' },
  'Cuttack': { state: 'Odisha', pincode: '753001' },
  // North
  'Chandigarh': { state: 'Chandigarh', pincode: '160001' },
  'Ludhiana': { state: 'Punjab', pincode: '141001' },
  'Amritsar': { state: 'Punjab', pincode: '143001' },
  'Dehradun': { state: 'Uttarakhand', pincode: '248001' },
  'Haridwar': { state: 'Uttarakhand', pincode: '249401' },
  'Shimla': { state: 'Himachal Pradesh', pincode: '171001' },
  'Jammu': { state: 'Jammu and Kashmir', pincode: '180001' },
  'Srinagar': { state: 'Jammu and Kashmir', pincode: '190001' },
  'Ambala': { state: 'Haryana', pincode: '133001' },
  'Karnal': { state: 'Haryana', pincode: '132001' },
  'Rohtak': { state: 'Haryana', pincode: '124001' },
  'Hisar': { state: 'Haryana', pincode: '125001' },
  // North-east
  'Guwahati': { state: 'Assam', pincode: '781001' },
  'Agartala': { state: 'Tripura', pincode: '799001' },
  'Imphal': { state: 'Manipur', pincode: '795001' },
  'Shillong': { state: 'Meghalaya', pincode: '793001' },
  'Aizawl': { state: 'Mizoram', pincode: '796001' },
  'Kohima': { state: 'Nagaland', pincode: '797001' },
  'Gangtok': { state: 'Sikkim', pincode: '737101' },
  // Others
  'Panaji': { state: 'Goa', pincode: '403001' },
  'Puducherry': { state: 'Puducherry', pincode: '605001' },
};

// Common alternate / older spellings -> the key used in CITY_DATA.
const CITY_ALIASES: Record<string, string> = {
  bombay: 'Mumbai',
  bangalore: 'Bengaluru',
  'bengaluru urban': 'Bengaluru',
  madras: 'Chennai',
  calcutta: 'Kolkata',
  gurgaon: 'Gurugram',
  cochin: 'Kochi',
  trivandrum: 'Thiruvananthapuram',
  calicut: 'Kozhikode',
  mysore: 'Mysuru',
  mangalore: 'Mangaluru',
  hubli: 'Hubballi',
  belgaum: 'Belagavi',
  vizag: 'Visakhapatnam',
  vishakhapatnam: 'Visakhapatnam',
  trichy: 'Tiruchirappalli',
  tiruchirapalli: 'Tiruchirappalli',
  tanjore: 'Thanjavur',
  allahabad: 'Prayagraj',
  benares: 'Varanasi',
  banaras: 'Varanasi',
  baroda: 'Vadodara',
  poona: 'Pune',
  panjim: 'Panaji',
  pondicherry: 'Puducherry',
  aurangabad: 'Chhatrapati Sambhajinagar', // Maharashtra's Aurangabad; Bihar also has one
  'sambhajinagar': 'Chhatrapati Sambhajinagar',
  'chh sambhajinagar': 'Chhatrapati Sambhajinagar',
  thiruchirappalli: 'Tiruchirappalli',
  'new bombay': 'Navi Mumbai',
  'greater noida': 'Noida',
  trissur: 'Thrissur',
  cuttak: 'Cuttack',
};

const CITY_BY_KEY = new Map<string, CityInfo>(Object.entries(CITY_DATA).map(([name, info]) => [squash(name), info]));
const ALIAS_BY_KEY = new Map<string, string>(Object.entries(CITY_ALIASES).map(([alias, name]) => [squash(alias), name]));

export interface CityMatch extends CityInfo {
  /** The spelling we'd show, e.g. typed "Bangalore" -> "Bengaluru" */
  canonicalName: string;
}

/**
 * Exact-match lookup (after normalising case, punctuation and common aliases).
 * We deliberately do NOT fuzzy/prefix match: filling "Kota" while someone is still
 * typing "Kotagiri" would be worse than filling nothing.
 */
export function lookupCity(input: string): CityMatch | null {
  // allow "Chennai, Tamil Nadu" or "Chennai - 600001" -> take the first chunk
  const first = input.split(/[,\-–|]/)[0] ?? '';
  const key = squash(first);
  if (key.length < 3) return null;

  const canonicalName = ALIAS_BY_KEY.get(key) ?? [...Object.keys(CITY_DATA)].find((n) => squash(n) === key);
  if (!canonicalName) return null;

  const info = CITY_BY_KEY.get(squash(canonicalName));
  return info ? { ...info, canonicalName } : null;
}