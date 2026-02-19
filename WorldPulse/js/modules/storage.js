/**
* WorldPulse — storage.js
* LocalStorage management.
* Stores: favorites, theme preference, last currency pair, search history.
*
* Properties saved (3-5 as required):
*  1. wp_favorites    — Array of favorited country CCA3 codes
*  2. wp_theme        — "light" | "dark"
*  3. wp_last_from    — Last "from" currency code in converter
*  4. wp_last_to      — Last "to" currency code in converter
*  5. wp_last_region  — Last selected region filter
*/

const KEYS = {
    FAVORITES: "wp_favorites",
    THEME: "wp_theme",
    LAST_FROM: "wp_last_from",
    LAST_TO: "wp_last_to",
    LAST_REGION: "wp_last_region",
};

// ── Helpers ────────────────────────────────────────────────

/**
 * Safely parse JSON from localStorage.
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
function getItem(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

/**
 * Safely stringify and store a value.
 * @param {string} key
 * @param {*} value
 */
function setItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.warn("[WorldPulse] localStorage write failed:", err);
    }
}

// ── Favorites ──────────────────────────────────────────────

/**
 * Get all favorited country codes.
 * @returns {string[]}
 */
export function getFavorites() {
    return getItem(KEYS.FAVORITES, []);
}

/**
 * Check if a country is favorited.
 * @param {string} code — CCA3 code
 * @returns {boolean}
 */
export function isFavorite(code) {
    return getFavorites().includes(code);
}

/**
 * Add a country to favorites.
 * @param {string} code
 */
export function addFavorite(code) {
    const favs = getFavorites();
    if (!favs.includes(code)) {
        favs.push(code);
        setItem(KEYS.FAVORITES, favs);
    }
}

/**
 * Remove a country from favorites.
 * @param {string} code
 */
export function removeFavorite(code) {
    const favs = getFavorites().filter((c) => c !== code);
    setItem(KEYS.FAVORITES, favs);
}

/**
 * Toggle favorite status and return the new state.
 * @param {string} code
 * @returns {boolean} — true if now favorited
 */
export function toggleFavorite(code) {
    if (isFavorite(code)) {
        removeFavorite(code);
        return false;
    }
    addFavorite(code);
    return true;
}

/**
 * Clear all favorites.
 */
export function clearFavorites() {
    setItem(KEYS.FAVORITES, []);
}

// ── Theme ──────────────────────────────────────────────────

export function getTheme() {
    return getItem(KEYS.THEME, "light");
}

export function setTheme(theme) {
    setItem(KEYS.THEME, theme);
}

// ── Currency Preferences ───────────────────────────────────

export function getLastFrom() {
    return getItem(KEYS.LAST_FROM, "USD");
}

export function setLastFrom(code) {
    setItem(KEYS.LAST_FROM, code);
}

export function getLastTo() {
    return getItem(KEYS.LAST_TO, "EUR");
}

export function setLastTo(code) {
    setItem(KEYS.LAST_TO, code);
}

// ── Region Preference ──────────────────────────────────────

export function getLastRegion() {
    return getItem(KEYS.LAST_REGION, "all");
}

export function setLastRegion(region) {
    setItem(KEYS.LAST_REGION, region);
}