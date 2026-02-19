/**
 * WorldPulse — app.js
 * Main entry point. Orchestrates module initialization,
 * event binding, and application state management.
 *
 * Event listeners (5+):
 *  1. DOMContentLoaded — bootstraps the app
 *  2. search-form submit — filter on search
 *  3. search-input input — live search with debounce
 *  4. filter-chip click — region filter
 *  5. sort-select change — sort order
 *  6. nav-btn click — tab switching
 *  7. theme-toggle click — dark/light mode
 *  8. modal-overlay / close — modal dismiss
 *  9. swap-btn click — currency swap
 *  10. conv-amount / conv-from / conv-to change — live conversion
 *  11. clear-favs click — clear all favorites
 *  12. clear-search click — reset search
 *  13. favorites-changed custom event — refresh favorites tab
 *  14. keydown Escape — close modal
 */

import { fetchAllCountries } from "./modules/api.js";
import { initConverter, swapCurrencies, updateConversion } from "./modules/converter.js";
import {
    filterCountries,
    sortCountries,
    renderCountryCards,
    renderFavorites,
    updateFavCount,
} from "./modules/countries.js";
import {
    collectUniqueLanguages,
    collectUniqueRegions,
    setLoading,
    setEmptyState,
    activateTab,
    formatCompact,
    formatNumber,
    closeModal,
} from "./utils/ui.js";
import {
    getTheme,
    setTheme,
    getLastRegion,
    setLastRegion,
    clearFavorites,
} from "./modules/storage.js";

// ── App State ────────────────────────────────────────────────
const state = {
    /** @type {Object[]} Full list of countries from API */
    allCountries: [],
    /** @type {string} Current search query */
    query: "",
    /** @type {string} Active region filter */
    region: getLastRegion(),
    /** @type {string} Active sort key */
    sort: "name",
    /** @type {boolean} Whether converter has been initialized */
    converterLoaded: false,
};

// ── DOM References ───────────────────────────────────────────
const countriesGrid = document.getElementById("countries-grid");
const favoritesGrid = document.getElementById("favorites-grid");
const favEmpty = document.getElementById("fav-empty");
const resultsMeta = document.getElementById("results-meta");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");

// ── Bootstrap ────────────────────────────────────────────────

/**
 * Bootstrap the application.
 * 1. Apply saved theme
 * 2. Fetch all country data
 * 3. Render initial view
 * 4. Update stats bar
 */
async function bootstrap() {
    applyTheme(getTheme());
    setLoading(true);

    try {
        const countries = await fetchAllCountries();
        state.allCountries = countries;

        setLoading(false);
        applyFiltersAndRender();
        renderGlobalStats(countries);
        updateFavCount();

    } catch (err) {
        console.error("[WorldPulse] Failed to load countries:", err);
        setLoading(false);
        countriesGrid.innerHTML = `
      <p style="color:var(--accent); grid-column:1/-1; text-align:center; padding:2rem">
        ⚠️ Could not load country data. Please check your connection and refresh.
      </p>`;
    }
}

// ── Render Logic ─────────────────────────────────────────────

/**
 * Apply current state filters/sort and re-render the countries grid.
 */
function applyFiltersAndRender() {
    const filtered = filterCountries(state.allCountries, state.query, state.region);
    const sorted = sortCountries(filtered, state.sort);

    if (sorted.length === 0) {
        setEmptyState(true);
        resultsMeta.textContent = "";
    } else {
        setEmptyState(false);
        renderCountryCards(sorted, countriesGrid);
        resultsMeta.textContent =
            `Showing ${sorted.length.toLocaleString()} of ${state.allCountries.length.toLocaleString()} countries`;
    }
}

// ── Stats Bar ─────────────────────────────────────────────────

/**
 * Compute and display global statistics in the stats bar.
 * @param {Object[]} countries
 */
function renderGlobalStats(countries) {
    const totalPop = countries.reduce((s, c) => s + (c.population ?? 0), 0);
    const languages = collectUniqueLanguages(countries);
    const regions = collectUniqueRegions(countries);

    animateStatNumber("stat-countries", countries.length.toString());
    animateStatNumber("stat-population", formatCompact(totalPop));
    animateStatNumber("stat-languages", languages.length.toString() + "+");
    animateStatNumber("stat-regions", regions.length.toString());
}

/**
 * Animate a stat number element with a brief CSS class.
 * @param {string} id
 * @param {string} value
 */
function animateStatNumber(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value;
    el.classList.add("counting");
    setTimeout(() => el.classList.remove("counting"), 500);
}

// ── Theme ─────────────────────────────────────────────────────

/**
 * Apply a theme to the document.
 * @param {"light"|"dark"} theme
 */
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const icon = document.querySelector(".theme-icon");
    if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
}

// ── Debounce ──────────────────────────────────────────────────

/**
 * Create a debounced version of a function.
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ── Event Listeners ───────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    bootstrap();
    bindEvents();
});

function bindEvents() {
    // 1. Search form submit
    document.getElementById("search-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        state.query = searchInput.value;
        applyFiltersAndRender();
    });

    // 2. Search input — live debounced search
    searchInput?.addEventListener(
        "input",
        debounce(() => {
            state.query = searchInput.value;
            applyFiltersAndRender();
        }, 300)
    );

    // 3. Region filter chips
    document.querySelectorAll(".filter-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".filter-chip").forEach((c) =>
                c.classList.remove("active")
            );
            chip.classList.add("active");
            state.region = chip.dataset.region;
            setLastRegion(state.region);
            applyFiltersAndRender();
        });
    });

    // Restore active filter chip from storage
    const savedRegion = getLastRegion();
    if (savedRegion && savedRegion !== "all") {
        document.querySelectorAll(".filter-chip").forEach((c) => {
            c.classList.toggle("active", c.dataset.region === savedRegion);
        });
        state.region = savedRegion;
    }

    // 4. Sort select
    document.getElementById("sort-select")?.addEventListener("change", (e) => {
        state.sort = e.target.value;
        applyFiltersAndRender();
    });

    // 5. Navigation tabs
    document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            activateTab(tab);

            // Lazy-init converter when first visiting the tab
            if (tab === "converter" && !state.converterLoaded) {
                state.converterLoaded = true;
                initConverter();
            }

            // Refresh favorites grid on tab visit
            if (tab === "favorites") {
                renderFavorites(state.allCountries, favoritesGrid, favEmpty);
            }
        });
    });

    // 6. Theme toggle
    document.getElementById("theme-toggle")?.addEventListener("click", () => {
        const current = document.documentElement.dataset.theme ?? "light";
        const next = current === "light" ? "dark" : "light";
        applyTheme(next);
        setTheme(next);
    });

    // 7. Modal close button
    document.getElementById("modal-close")?.addEventListener("click", closeModal);

    // 8. Modal overlay backdrop click
    document.getElementById("modal-overlay")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeModal();
    });

    // 9. Escape key to close modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    // 10. Swap currencies button
    document.getElementById("swap-btn")?.addEventListener("click", swapCurrencies);

    // 11. Live conversion — amount input
    document.getElementById("conv-amount")?.addEventListener("input",
        debounce(updateConversion, 400)
    );

    // 12. Live conversion — currency selects
    document.getElementById("conv-from")?.addEventListener("change", updateConversion);
    document.getElementById("conv-to")?.addEventListener("change", updateConversion);

    // 13. Clear all favorites
    document.getElementById("clear-favs")?.addEventListener("click", () => {
        if (!confirm("Remove all favorites?")) return;
        clearFavorites();
        renderFavorites(state.allCountries, favoritesGrid, favEmpty);
        updateFavCount();
        // Sync all fav buttons on the explore grid
        document.querySelectorAll(".fav-btn").forEach((b) => {
            b.textContent = "☆";
            b.setAttribute("aria-pressed", "false");
        });
    });

    // 14. Clear search button (empty state)
    clearSearchBtn?.addEventListener("click", () => {
        searchInput.value = "";
        state.query = "";
        applyFiltersAndRender();
        searchInput.focus();
    });

    // 15. Custom event: favorites changed (from cards or modal)
    document.addEventListener("favorites-changed", () => {
        // Only re-render favs grid if the tab is active
        const favPanel = document.getElementById("tab-favorites");
        if (!favPanel?.hidden) {
            renderFavorites(state.allCountries, favoritesGrid, favEmpty);
        }
    });
} 