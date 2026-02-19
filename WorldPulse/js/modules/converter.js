/**
* WorldPulse — converter.js
* Handles currency conversion UI, loading exchange rate data,
* and populating the currency selects.
*/

import {
    fetchCurrencies,
    fetchExchangeRates,
    convertCurrency,
} from "./api.js";

import {
    getLastFrom,
    getLastTo,
    setLastFrom,
    setLastTo,
} from "./storage.js";

import { showToast } from "../utils/ui.js";

// Popular currencies to display in the "quick rates" section
const POPULAR = ["GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "ZAR"];

let cachedRates = null; // { base, date, rates }
let currencyNames = {};   // { USD: "US Dollar", ... }

// ── Init ────────────────────────────────────────────────────

/**
 * Initialize the currency converter tab.
 * Loads currencies and exchange rates, then sets up all events.
 */
export async function initConverter() {
    try {
        // Load available currency names and initial rates in parallel
        const [currencies, rates] = await Promise.all([
            fetchCurrencies(),
            fetchExchangeRates("USD"),
        ]);

        currencyNames = currencies;
        cachedRates = rates;

        populateCurrencySelects(currencies);
        renderPopularRates(rates);
        updateConversion();

    } catch (err) {
        console.error("[Converter] Init failed:", err);
        showToast("⚠️ Could not load exchange rates. Please try again.");
    }
}

// ── Populate Selects ─────────────────────────────────────────

/**
 * Fill the "from" and "to" <select> elements with all available currencies.
 * Restores user's last-used preferences from localStorage.
 * @param {Object} currencies — { USD: "US Dollar", ... }
 */
function populateCurrencySelects(currencies) {
    const fromSelect = document.getElementById("conv-from");
    const toSelect = document.getElementById("conv-to");
    if (!fromSelect || !toSelect) return;

    const lastFrom = getLastFrom();
    const lastTo = getLastTo();

    const options = Object.entries(currencies)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([code, name]) => `<option value="${code}">${code} — ${name}</option>`)
        .join("");

    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;

    fromSelect.value = lastFrom;
    toSelect.value = lastTo;
}

// ── Conversion ───────────────────────────────────────────────

/**
 * Run a currency conversion and update the result display.
 * Uses the Frankfurter API's convert endpoint for accurate results.
 */
export async function updateConversion() {
    const amountInput = document.getElementById("conv-amount");
    const fromSelect = document.getElementById("conv-from");
    const toSelect = document.getElementById("conv-to");
    const resultEl = document.getElementById("result-amount");
    const labelEl = document.getElementById("result-label");
    const rateInfoEl = document.getElementById("rate-info");

    if (!amountInput || !fromSelect || !toSelect) return;

    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
        resultEl.textContent = "—";
        labelEl.textContent = "Enter a valid amount";
        return;
    }

    if (from === to) {
        resultEl.textContent = amount.toFixed(2);
        labelEl.textContent = `${from} = ${to}`;
        return;
    }

    // Persist user preference
    setLastFrom(from);
    setLastTo(to);

    resultEl.textContent = "…";
    labelEl.textContent = "Fetching rate…";

    try {
        const data = await convertCurrency(amount, from, to);
        const converted = data.rates[to];

        // Format the result nicely
        const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
        });

        resultEl.textContent = formatter.format(converted);
        labelEl.textContent = `${amount} ${from} = ${formatter.format(converted)} ${to}`;

        const rate = converted / amount;
        rateInfoEl.textContent = `1 ${from} = ${rate.toFixed(6)} ${to} · ${data.date}`;

    } catch (err) {
        console.error("[Converter] Conversion failed:", err);
        resultEl.textContent = "Error";
        labelEl.textContent = "Could not fetch rate";
        showToast("⚠️ Conversion failed — check network connection");
    }
}

// ── Popular Rates ─────────────────────────────────────────────

/**
 * Render the popular exchange rates grid (vs USD base).
 * @param {{ base: string, date: string, rates: Object }} rates
 */
function renderPopularRates(rates) {
    const grid = document.getElementById("rh-grid");
    if (!grid) return;

    const items = POPULAR
        .filter((code) => rates.rates[code] !== undefined)
        .map((code) => {
            const rate = rates.rates[code].toFixed(4);
            const name = currencyNames[code] ?? code;
            return `
        <div class="rh-item" title="${name}">
          <div class="rh-code">${code}</div>
          <div class="rh-rate">${rate}</div>
        </div>
      `;
        });

    grid.innerHTML = items.join("");
}

// ── Swap Currencies ───────────────────────────────────────────

/**
 * Swap the "from" and "to" currencies, then re-run conversion.
 */
export function swapCurrencies() {
    const fromSelect = document.getElementById("conv-from");
    const toSelect = document.getElementById("conv-to");
    if (!fromSelect || !toSelect) return;

    const tmp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tmp;

    // Animate the swap button
    const swapBtn = document.getElementById("swap-btn");
    swapBtn?.classList.add("spinning");
    setTimeout(() => swapBtn?.classList.remove("spinning"), 400);

    updateConversion();
}