/**
* WorldPulse — countries.js
* Handles country card rendering, sorting, filtering,
* modal display, and favorites rendering.
*/

import {
    formatNumber,
    formatCompact,
    formatArea,
    getCountryName,
    getOfficialName,
    getCapital,
    getLanguages,
    getCurrencies,
    openModal,
    showToast,
} from "../utils/ui.js";

import {
    toggleFavorite,
    isFavorite,
    getFavorites,
} from "./storage.js";

// ── Country Card ────────────────────────────────────────────

/**
 * Build a country card DOM element.
 * @param {Object} country — REST Countries API object
 * @returns {HTMLElement}
 */
export function buildCountryCard(country) {
    const code = country.cca3;
    const name = getCountryName(country);
    const flagUrl = country.flags?.png ?? country.flags?.svg ?? "";
    const flagAlt = country.flags?.alt ?? `Flag of ${name}`;
    const capital = getCapital(country);
    const population = formatCompact(country.population);
    const area = formatArea(country.area);
    const region = country.region ?? "—";
    const favored = isFavorite(code);

    const article = document.createElement("article");
    article.className = "country-card";
    article.setAttribute("role", "listitem");
    article.setAttribute("tabindex", "0");
    article.setAttribute("aria-label", `${name} — click for details`);
    article.dataset.code = code;

    article.innerHTML = `
    <div class="flag-wrap">
      <img
        class="flag-img"
        src="${flagUrl}"
        alt="${flagAlt}"
        loading="lazy"
        width="320"
        height="180"
      />
      <div class="card-actions">
        <button
          class="fav-btn"
          aria-label="${favored ? "Remove from favorites" : "Add to favorites"}"
          aria-pressed="${favored}"
          data-code="${code}"
          title="${favored ? "Remove from favorites" : "Add to favorites"}"
        >${favored ? "⭐" : "☆"}</button>
      </div>
    </div>
    <div class="card-body">
      <h2 class="card-country-name">${name}</h2>
      <span class="card-region">${region}</span>
      <div class="card-stat">
        <span>Capital</span>
        <strong>${capital}</strong>
      </div>
      <div class="card-stat">
        <span>Population</span>
        <strong>${population}</strong>
      </div>
      <div class="card-stat">
        <span>Area</span>
        <strong>${area}</strong>
      </div>
    </div>
  `;

    // Click on card → open modal
    article.addEventListener("click", (e) => {
        // Don't open modal if clicking the fav button
        if (e.target.closest(".fav-btn")) return;
        openCountryModal(country);
    });

    // Enter / Space on keyboard for accessibility
    article.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openCountryModal(country);
        }
    });

    // Favorite button click
    const favBtn = article.querySelector(".fav-btn");
    favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleFavToggle(favBtn, code, name);
    });

    return article;
}

/**
 * Toggle favorite and update all buttons sharing the same country code.
 * @param {HTMLButtonElement} btn
 * @param {string} code
 * @param {string} name
 */
function handleFavToggle(btn, code, name) {
    const isNowFav = toggleFavorite(code);
    const label = isNowFav ? "Remove from favorites" : "Add to favorites";
    const icon = isNowFav ? "⭐" : "☆";

    // Update all fav buttons for this country across the page
    document.querySelectorAll(`.fav-btn[data-code="${code}"]`).forEach((b) => {
        b.textContent = icon;
        b.setAttribute("aria-label", label);
        b.setAttribute("aria-pressed", String(isNowFav));
        b.classList.add("favorited");
        setTimeout(() => b.classList.remove("favorited"), 400);
    });

    showToast(isNowFav ? `⭐ ${name} added to favorites` : `Removed ${name} from favorites`);

    // Dispatch custom event so the favorites tab can refresh
    document.dispatchEvent(new CustomEvent("favorites-changed"));
    updateFavCount();
}

/**
 * Update the navigation favorite count badge.
 */
export function updateFavCount() {
    const count = getFavorites().length;
    const badge = document.getElementById("fav-count");
    if (badge) badge.textContent = count;
}

// ── Render Functions ────────────────────────────────────────

/**
 * Render an array of country cards into a grid element.
 * @param {Object[]} countries
 * @param {HTMLElement} container
 */
export function renderCountryCards(countries, container) {
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    countries.forEach((country) => {
        fragment.appendChild(buildCountryCard(country));
    });
    container.appendChild(fragment);
}

/**
 * Render the favorites grid using stored codes and the full country data.
 * @param {Object[]} allCountries — full country data array
 * @param {HTMLElement} grid
 * @param {HTMLElement} emptyMsg
 */
export function renderFavorites(allCountries, grid, emptyMsg) {
    const codes = getFavorites();
    const favList = allCountries.filter((c) => codes.includes(c.cca3));

    if (favList.length === 0) {
        grid.innerHTML = "";
        emptyMsg.classList.remove("hidden");
    } else {
        emptyMsg.classList.add("hidden");
        renderCountryCards(favList, grid);
    }
}

// ── Sort & Filter ────────────────────────────────────────────

/**
 * Filter countries by search query and active region.
 * @param {Object[]} countries
 * @param {string} query
 * @param {string} region — "all" or a specific region
 * @returns {Object[]}
 */
export function filterCountries(countries, query, region) {
    let result = countries;

    if (region !== "all") {
        result = result.filter((c) => c.region === region);
    }

    if (query.trim()) {
        const q = query.toLowerCase().trim();
        result = result.filter((c) => {
            const name = getCountryName(c).toLowerCase();
            const capital = (c.capital ?? []).join("").toLowerCase();
            const official = (c.name?.official ?? "").toLowerCase();
            return name.includes(q) || capital.includes(q) || official.includes(q);
        });
    }

    return result;
}

/**
 * Sort an array of countries by a given sort key.
 * @param {Object[]} countries
 * @param {string} sortKey
 * @returns {Object[]}
 */
export function sortCountries(countries, sortKey) {
    const copy = [...countries];

    switch (sortKey) {
        case "name":
            return copy.sort((a, b) =>
                getCountryName(a).localeCompare(getCountryName(b))
            );
        case "name-desc":
            return copy.sort((a, b) =>
                getCountryName(b).localeCompare(getCountryName(a))
            );
        case "pop-desc":
            return copy.sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
        case "pop-asc":
            return copy.sort((a, b) => (a.population ?? 0) - (b.population ?? 0));
        case "area-desc":
            return copy.sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
        default:
            return copy;
    }
}

// ── Country Modal ────────────────────────────────────────────

/**
 * Open a detailed modal for a country.
 * @param {Object} country
 */
export function openCountryModal(country) {
    const name = getCountryName(country);
    const official = getOfficialName(country);
    const code = country.cca3;
    const capital = getCapital(country);
    const population = formatNumber(country.population);
    const area = formatArea(country.area);
    const region = country.region ?? "—";
    const subregion = country.subregion ?? "—";
    const languages = getLanguages(country);
    const currencies = getCurrencies(country);
    const timezones = (country.timezones ?? []).slice(0, 3).join(", ");
    const tld = (country.tld ?? []).join(", ") || "—";
    const flagUrl = country.flags?.png ?? country.flags?.svg ?? "";
    const flagAlt = country.flags?.alt ?? `Flag of ${name}`;
    const mapsUrl = country.maps?.googleMaps ?? "#";
    const isFav = isFavorite(code);

    // Build currency pills HTML
    const currencyHTML = currencies.length
        ? currencies.map((c) =>
            `<span class="currency-pill">${c.code} ${c.symbol} — ${c.name}</span>`
        ).join("")
        : "<span class='currency-pill'>N/A</span>";

    // Build borders list
    const bordersHTML = (country.borders ?? []).length
        ? country.borders.map((b) => `<span class="modal-tag">${b}</span>`).join("")
        : "<span class='modal-tag'>None / Island</span>";

    const html = `
    <img
      class="modal-flag"
      src="${flagUrl}"
      alt="${flagAlt}"
    />
    <h2 class="modal-country-name" id="modal-country-name">${name}</h2>
    <p class="modal-official-name">${official !== name ? official : ""}</p>

    <div class="modal-grid">
      <div class="modal-stat">
        <span class="modal-stat-label">Capital</span>
        <span class="modal-stat-value">${capital}</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat-label">Region</span>
        <span class="modal-stat-value">${region} › ${subregion}</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat-label">Population</span>
        <span class="modal-stat-value">${population}</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat-label">Area</span>
        <span class="modal-stat-value">${area}</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat-label">Languages</span>
        <span class="modal-stat-value">${languages}</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat-label">Top-Level Domain</span>
        <span class="modal-stat-value">${tld}</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat-label">Timezones</span>
        <span class="modal-stat-value">${timezones}</span>
      </div>
      <div class="modal-stat">
        <span class="modal-stat-label">CCA3 Code</span>
        <span class="modal-stat-value">${code}</span>
      </div>
    </div>

    <hr class="modal-divider" />

    <div class="modal-stat">
      <span class="modal-stat-label">Currencies</span>
      <div class="modal-currencies">${currencyHTML}</div>
    </div>

    <hr class="modal-divider" />

    <div class="modal-stat">
      <span class="modal-stat-label">Bordering Countries</span>
      <div class="modal-tags">${bordersHTML}</div>
    </div>

    <div style="margin-top:1.5rem">
      <a
        href="${mapsUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="modal-map-link"
        aria-label="View ${name} on Google Maps (opens new tab)"
      >
        🗺️ View on Maps
      </a>
      <button
        class="modal-fav-btn"
        data-code="${code}"
        aria-label="${isFav ? "Remove from favorites" : "Add to favorites"}"
        aria-pressed="${isFav}"
      >
        ${isFav ? "⭐ Favorited" : "☆ Add to Favorites"}
      </button>
    </div>
  `;

    openModal(html);

    // Bind the modal favorite button
    const modalFavBtn = document.querySelector(".modal-fav-btn");
    if (modalFavBtn) {
        modalFavBtn.addEventListener("click", () => {
            const isNowFav = toggleFavorite(code);
            modalFavBtn.textContent = isNowFav ? "⭐ Favorited" : "☆ Add to Favorites";
            modalFavBtn.setAttribute("aria-pressed", String(isNowFav));

            // Sync card buttons
            document.querySelectorAll(`.fav-btn[data-code="${code}"]`).forEach((b) => {
                b.textContent = isNowFav ? "⭐" : "☆";
                b.setAttribute("aria-pressed", String(isNowFav));
            });

            showToast(isNowFav ? `⭐ ${name} added to favorites` : `Removed ${name}`);
            document.dispatchEvent(new CustomEvent("favorites-changed"));
            updateFavCount();
        });
    }
}