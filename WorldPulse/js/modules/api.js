/**
* WorldPulse — api.js
* Handles all external API communication.
*
* APIs used:
*  1. REST Countries v3.1 — https://restcountries.com/
*  2. Frankfurter Exchange Rates — https://api.frankfurter.app/ (free, no key needed)
*/

// ── Base URLs ──────────────────────────────────────────────
const COUNTRIES_BASE = "https://restcountries.com/v3.1";
const EXCHANGE_BASE = "https://api.frankfurter.app";

// Fields we request from the Countries API (reduces payload size)
const FIELDS = [
    "name", "flags", "capital", "region", "subregion",
    "population", "area", "languages", "currencies",
    "timezones", "borders", "maps", "continents", "tld",
    "latlng", "idd", "cca3", "independent"
].join(",");

/**
 * Generic fetch helper with error handling.
 * @param {string} url
 * @returns {Promise<any>}
 */
async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} — ${response.statusText} (${url})`);
    }
    return response.json();
}

// ── Countries API ──────────────────────────────────────────

/**
 * Fetch all countries with selected fields.
 * Returns an array of country objects (8+ attributes each).
 * @returns {Promise<Object[]>}
 */
export async function fetchAllCountries() {
    return fetchJSON(`${COUNTRIES_BASE}/all?fields=${FIELDS}`);
}

/**
 * Fetch countries by region.
 * @param {string} region — e.g. "Africa", "Europe"
 * @returns {Promise<Object[]>}
 */
export async function fetchByRegion(region) {
    return fetchJSON(`${COUNTRIES_BASE}/region/${region}?fields=${FIELDS}`);
}

/**
 * Fetch a single country by CCA3 code.
 * @param {string} code — e.g. "USA", "DEU"
 * @returns {Promise<Object[]>}
 */
export async function fetchCountryByCode(code) {
    return fetchJSON(`${COUNTRIES_BASE}/alpha/${code}?fields=${FIELDS}`);
}

/**
 * Fetch countries by name search.
 * @param {string} name
 * @returns {Promise<Object[]>}
 */
export async function searchCountriesByName(name) {
    return fetchJSON(
        `${COUNTRIES_BASE}/name/${encodeURIComponent(name)}?fields=${FIELDS}`
    );
}

// ── Exchange Rate API (Frankfurter) ────────────────────────

/**
 * Fetch all available currencies from Frankfurter.
 * @returns {Promise<Object>} — { USD: "US Dollar", EUR: "Euro", ... }
 */
export async function fetchCurrencies() {
    return fetchJSON(`${EXCHANGE_BASE}/currencies`);
}

/**
 * Fetch latest exchange rates for a base currency.
 * @param {string} base — e.g. "USD"
 * @returns {Promise<Object>} — { base, date, rates: { EUR: 0.9, ... } }
 */
export async function fetchExchangeRates(base = "USD") {
    return fetchJSON(`${EXCHANGE_BASE}/latest?from=${base}`);
}

/**
 * Convert an amount between two currencies.
 * @param {number} amount
 * @param {string} from — currency code
 * @param {string} to   — currency code
 * @returns {Promise<Object>} — { amount, base, rates: { [to]: result } }
 */
export async function convertCurrency(amount, from, to) {
    return fetchJSON(
        `${EXCHANGE_BASE}/latest?amount=${amount}&from=${from}&to=${to}`
    );
}