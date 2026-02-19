/**
* WorldPulse — ui.js
* UI utility functions: toast notifications, modal control,
* number formatting, and DOM helpers.
*/

// ── Toast Notifications ────────────────────────────────────

const toastContainer = document.getElementById("toast-container");

/**
 * Show a short toast notification that auto-dismisses.
 * @param {string} message
 * @param {number} [duration=2800] — ms before auto-removal
 */
export function showToast(message, duration = 2800) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.setAttribute("role", "status");
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "slideOutRight 0.3s ease forwards";
        toast.addEventListener("animationend", () => toast.remove());
    }, duration);
}

// ── Modal ──────────────────────────────────────────────────

const overlay = document.getElementById("modal-overlay");
const modalBody = document.getElementById("modal-body");

/**
 * Open the modal with given HTML content.
 * @param {string} html
 */
export function openModal(html) {
    modalBody.innerHTML = html;
    overlay.hidden = false;
    // Move focus to the close button for accessibility
    document.getElementById("modal-close").focus();
    document.body.style.overflow = "hidden";
}

/**
 * Close the modal.
 */
export function closeModal() {
    overlay.hidden = true;
    modalBody.innerHTML = "";
    document.body.style.overflow = "";
}

// ── Number Formatting ──────────────────────────────────────

const numFormatter = new Intl.NumberFormat("en-US");

/**
 * Format a large number with commas.
 * @param {number} n
 * @returns {string}
 */
export function formatNumber(n) {
    if (!n && n !== 0) return "N/A";
    return numFormatter.format(n);
}

/**
 * Compact-format a large number (e.g. 1.4B, 250M).
 * @param {number} n
 * @returns {string}
 */
export function formatCompact(n) {
    if (!n && n !== 0) return "N/A";
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return String(n);
}

/**
 * Format area in km².
 * @param {number} area
 * @returns {string}
 */
export function formatArea(area) {
    if (!area) return "N/A";
    return `${formatNumber(Math.round(area))} km²`;
}

// ── Country Data Helpers ────────────────────────────────────

/**
 * Extract the common name from a country object.
 * @param {Object} country
 * @returns {string}
 */
export function getCountryName(country) {
    return country?.name?.common ?? "Unknown";
}

/**
 * Extract official name.
 * @param {Object} country
 * @returns {string}
 */
export function getOfficialName(country) {
    return country?.name?.official ?? "";
}

/**
 * Extract the capital city string.
 * @param {Object} country
 * @returns {string}
 */
export function getCapital(country) {
    return country?.capital?.join(", ") ?? "N/A";
}

/**
 * Extract languages as a comma-separated string.
 * @param {Object} country
 * @returns {string}
 */
export function getLanguages(country) {
    const langs = country?.languages;
    if (!langs) return "N/A";
    return Object.values(langs).join(", ");
}

/**
 * Extract currencies as objects: [{code, name, symbol}]
 * @param {Object} country
 * @returns {Array<{code:string, name:string, symbol:string}>}
 */
export function getCurrencies(country) {
    const cur = country?.currencies;
    if (!cur) return [];
    return Object.entries(cur).map(([code, info]) => ({
        code,
        name: info.name ?? code,
        symbol: info.symbol ?? "",
    }));
}

/**
 * Get a flat array of unique language names from a country list.
 * @param {Object[]} countries
 * @returns {string[]}
 */
export function collectUniqueLanguages(countries) {
    const set = new Set();
    countries.forEach((c) => {
        if (c.languages) {
            Object.values(c.languages).forEach((lang) => set.add(lang));
        }
    });
    return [...set];
}

/**
 * Get a list of unique region names from a country list.
 * @param {Object[]} countries
 * @returns {string[]}
 */
export function collectUniqueRegions(countries) {
    return [...new Set(countries.map((c) => c.region).filter(Boolean))];
}

// ── Tab Management ─────────────────────────────────────────

/**
 * Activate a specific tab panel and update nav button states.
 * @param {string} tabId — "explore" | "converter" | "favorites"
 */
export function activateTab(tabId) {
    // Deactivate all
    document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.hidden = true;
        panel.classList.remove("active");
    });
    document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.remove("active");
        btn.removeAttribute("aria-current");
    });

    // Activate target
    const panel = document.getElementById(`tab-${tabId}`);
    const btn = document.querySelector(`[data-tab="${tabId}"]`);
    if (panel) {
        panel.hidden = false;
        panel.classList.add("active");
    }
    if (btn) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "page");
    }
}

// ── Loading State ──────────────────────────────────────────

const loaderEl = document.getElementById("loader");
const gridEl = document.getElementById("countries-grid");
const emptyStateEl = document.getElementById("empty-state");

/**
 * Show/hide the loading spinner.
 * @param {boolean} visible
 */
export function setLoading(visible) {
    if (loaderEl) loaderEl.style.display = visible ? "flex" : "none";
}

/**
 * Show/hide the empty state message.
 * @param {boolean} visible
 */
export function setEmptyState(visible) {
    if (emptyStateEl) {
        emptyStateEl.classList.toggle("hidden", !visible);
    }
    if (gridEl) {
        gridEl.style.display = visible ? "none" : "";
    }
}