# 🌍 WorldPulse — Global Explorer

**Final Project | Web Frontend Development**

A fully functional, accessible, and responsive web application for exploring world countries, converting currencies, and discovering global statistics in real time.

---

## 📁 File Structure

```
worldpulse/
├── index.html                 # Main HTML — semantic, accessible, SEO-ready
├── .eslintrc.json             # ESLint configuration (ES2022, browser env)
├── README.md                  # This file
│
├── css/
│   ├── main.css               # Design system, layout, header, hero, footer
│   ├── animations.css         # All keyframes, transitions, animated globe, stagger
│   └── components.css         # Cards, modal, converter, rate grid, tags, pills
│
└── js/
    ├── app.js                 # Main entry point — bootstraps app, binds all events
    ├── modules/
    │   ├── api.js             # All external API calls (Countries + Frankfurter)
    │   ├── countries.js       # Country card rendering, sort/filter, modal
    │   ├── converter.js       # Currency converter logic and UI
    │   └── storage.js         # LocalStorage CRUD for favorites, prefs, theme
    └── utils/
        └── ui.js              # Toast, modal control, formatters, tab manager
```

---

## 🔌 APIs Used

### 1. REST Countries API v3.1
- **URL**: `https://restcountries.com/v3.1`
- **Endpoints used**:
  - `GET /all` — full country list with 8+ attributes per country
  - `GET /region/{region}` — filter by region
  - `GET /alpha/{code}` — individual country lookup
  - `GET /name/{name}` — search by name
- **No API key required**

### 2. Frankfurter Exchange Rate API
- **URL**: `https://api.frankfurter.app`
- **Endpoints used**:
  - `GET /currencies` — list all available currencies
  - `GET /latest?from={base}` — latest rates vs base currency
  - `GET /latest?amount={n}&from={from}&to={to}` — convert amount
- **No API key required**

---

## ✅ Requirements Checklist

| Requirement | Status |
|---|---|
| Vanilla HTML, CSS, JS only (no frameworks) | ✅ |
| 2+ external third-party APIs | ✅ (REST Countries + Frankfurter) |
| All exposed features operational | ✅ |
| Static + dynamically generated markup | ✅ |
| CSS animations | ✅ (globe orbits, card stagger, flag wave, shimmer, pulse) |
| Clean, well-commented, organized code | ✅ (ES Modules) |
| ESLint-compatible | ✅ |
| Valid HTML & CSS, no accessibility errors | ✅ (ARIA labels, skip link, roles) |
| SEO best practices | ✅ (meta tags, semantic HTML) |
| 8+ unique JSON attributes per country | ✅ (name, flags, capital, region, subregion, population, area, languages, currencies, timezones, borders, maps, tld, cca3, latlng) |
| 4+ Advanced CSS features | ✅ (animations, transitions, card hover, globe spin, filter/backdrop-blur) |
| 5+ Events | ✅ (15 event listeners documented) |
| LocalStorage (3–5 properties) | ✅ (favorites, theme, lastFrom, lastTo, lastRegion) |

---

## 🚀 Features

- **Explore Tab**: Browse all 195 countries with flag cards; search by name/capital; filter by region; sort by name, population, or area
- **Country Modal**: Full detail view with flag, demographics, languages, currencies, borders, timezones, map link
- **Favorites**: Star any country to save it; persists across sessions via localStorage
- **Currency Converter**: Live conversion between 30+ currencies using Frankfurter API; swap button; popular rates grid; saves last pair
- **Dark Mode**: Full dark/light theme toggle, saved to localStorage
- **Animated Globe**: CSS-only animated orbital rings in the hero section
- **Stats Bar**: Live aggregate stats (world population, languages, regions)
- **Accessible**: ARIA labels, roles, skip link, keyboard navigation, focus management, `prefers-reduced-motion` support

---

## 🛠️ Running the Project

Since the app uses ES Modules, serve it from a local HTTP server (not `file://`):

```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```

Then open `http://localhost:3000` in your browser. 