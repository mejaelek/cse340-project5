# CSE 340 — Assignment 4: Inventory Management
## Full-Stack MVC Application with Validation & Form Stickiness

---

## 📁 Complete File Structure

```
cse340-assignment4/
│
├── server.js                          ← App entry point, middleware setup
├── package.json                       ← Dependencies
├── .env.example                       ← Environment variable template
├── .gitignore
│
├── database/
│   ├── index.js                       ← PostgreSQL connection pool
│   └── setup.sql                      ← Schema + seed data (run once)
│
├── models/
│   ├── inventory-model.js             ← All DB queries (classifications + inventory)
│   └── account-model.js              ← Account queries (stub)
│
├── controllers/
│   ├── invController.js               ← All inventory/classification logic
│   ├── baseController.js             ← Home page + error trigger
│   └── accountController.js          ← Login/register stubs
│
├── routes/
│   ├── base.js                        ← / and /error routes
│   ├── inventoryRoute.js              ← /inv/* routes with validation middleware
│   └── accountRoute.js               ← /account/* routes
│
├── utilities/
│   ├── index.js                       ← getNav(), buildClassificationList(),
│   │                                     buildClassificationGrid(),
│   │                                     buildVehicleDetail(), handleErrors()
│   └── inventory-validation.js        ← express-validator rules + check functions
│
├── views/
│   ├── layouts/
│   │   └── layout.ejs                 ← Master layout (header, nav, footer)
│   ├── index.ejs                      ← Home page
│   ├── inventory/
│   │   ├── management.ejs             ← Task 1: Management view (/inv/)
│   │   ├── add-classification.ejs     ← Task 2: Add classification form
│   │   ├── add-inventory.ejs          ← Task 3: Add inventory form (sticky)
│   │   ├── classification.ejs         ← Inventory grid by category
│   │   └── detail.ejs                 ← Single vehicle detail
│   ├── errors/
│   │   └── error.ejs                  ← 404 / 500 error view
│   └── account/
│       ├── login.ejs
│       └── register.ejs
│
└── public/
    ├── css/
    │   └── styles.css                 ← Full responsive stylesheet
    ├── js/
    │   └── main.js                    ← Global JS (flash auto-dismiss, nav highlight)
    └── images/
        └── vehicles/
            ├── no-image.png           ← Default full image (add manually)
            └── no-image-tn.png        ← Default thumbnail (add manually)
```

---

## 🚀 Setup & Installation

### 1. Clone / Download
```bash
git clone <your-repo-url>
cd cse340-assignment4
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```
Edit `.env`:
```
PORT=5500
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/cse340
SESSION_SECRET=change-me-to-something-long-and-random
```

### 4. Database Setup
In your PostgreSQL client (pgAdmin, psql, or similar):
```sql
-- Run the setup file
\i database/setup.sql
```

### 5. Add Placeholder Images
Place these two images in `public/images/vehicles/`:
- `no-image.png` — full-size placeholder (e.g., 800×600)
- `no-image-tn.png` — thumbnail placeholder (e.g., 300×200)

You can find a "No Image Available" placeholder from any free stock source.

### 6. Run the App
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Visit: `http://localhost:5500`

---

## 🗺 Route Reference

| Method | Route                        | Description                         |
|--------|------------------------------|-------------------------------------|
| GET    | `/`                          | Home page                           |
| GET    | `/inv/`                      | **Management view** (Task 1)        |
| GET    | `/inv/add-classification`    | Add classification form (Task 2)    |
| POST   | `/inv/add-classification`    | Process new classification (Task 2) |
| GET    | `/inv/add-inventory`         | Add inventory form (Task 3)         |
| POST   | `/inv/add-inventory`         | Process new inventory item (Task 3) |
| GET    | `/inv/type/:classificationId`| View vehicles by classification     |
| GET    | `/inv/detail/:inventoryId`   | View single vehicle detail          |
| GET    | `/account/login`             | Login page                          |
| GET    | `/account/register`          | Register page                       |
| GET    | `/error`                     | Intentional 500 error (testing)     |

---

## ✅ Assignment Checklist

### Task 1 — Management View (`/inv/`)
- [x] Located at `views/inventory/management.ejs`
- [x] Has h1 title: "Vehicle Management"
- [x] Can display flash messages from controller
- [x] Contains link → Add Classification (`/inv/add-classification`)
- [x] Contains link → Add Inventory (`/inv/add-inventory`)
- [x] No nav link — accessed only via URL manipulation (`/inv/`)
- [x] Delivered via MVC (route → controller → view)
- [x] Meets frontend checklist

### Task 2 — Add Classification
- [x] `views/inventory/add-classification.ejs` created
- [x] Single input: `classification_name`
- [x] Rules displayed: no spaces, no special characters, letters/numbers only
- [x] **Client-side validation** (pattern regex, real-time feedback, submit block)
- [x] **Server-side validation** (`express-validator`, `inventory-validation.js`)
- [x] MVC architecture: route → validation middleware → controller → model
- [x] Flash messages displayed (success and failure)
- [x] On success: nav rebuilt + management view rendered with success flash
- [x] On failure: add-classification view re-rendered with error messages
- [x] Meets frontend checklist

### Task 3 — Add Inventory
- [x] `views/inventory/add-inventory.ejs` created
- [x] All fields match `inventory` table (no `inv_id` — auto-increment)
- [x] **Client-side validation** for all inputs
- [x] **Form stickiness** — all values preserved on validation failure
- [x] Classification **dynamic select list** built via `utilities.buildClassificationList()`
- [x] `classification_name` shown to user, `classification_id` as option value
- [x] Selected classification preserved (sticky) on error
- [x] Default image paths pre-filled with `no-image.png` / `no-image-tn.png`
- [x] **Server-side validation** for all fields
- [x] Flash messages (success and failure)
- [x] On success: management view with success flash
- [x] On failure: add-inventory re-rendered with errors + sticky values
- [x] MVC architecture throughout
- [x] Meets frontend checklist

### General Requirements
- [x] Error handling middleware (via `utilities.handleErrors` wrapper)
- [x] Session + flash message setup (`connect-flash`, `express-messages`)
- [x] Parameterized SQL statements (prevents SQL injection)
- [x] Responsive design (mobile, tablet, desktop)
- [x] CSS validity indicators (green valid / red invalid)
- [x] 404 and 500 error pages

---

## 🎨 Design Notes

**Aesthetic:** Industrial Editorial Dark
- **Colors:** Dark steel backgrounds (`#0d0f14`), amber accent (`#e8a020`), muted steel text
- **Typography:** Bebas Neue (display/headings) + DM Sans (body)
- **Features:** Sticky nav, CSS validity states, animated error banners, hex grid hero decoration

---

## 🔐 Validation Rules

### Classification Name
| Rule | Requirement |
|------|-------------|
| Required | Yes |
| Pattern | Letters and numbers only — `^[A-Za-z0-9]+$` |
| No spaces | Enforced client + server side |
| No special chars | Enforced client + server side |

### Inventory Fields
| Field | Rule |
|-------|------|
| `inv_make` | Required, 2–50 chars |
| `inv_model` | Required, 1–50 chars |
| `inv_year` | Required, 4-digit integer, 1900–9999 |
| `inv_description` | Required, min 10 chars |
| `inv_image` | Required, valid image extension (.jpg/.png/.gif/.webp) |
| `inv_thumbnail` | Required, valid image extension |
| `inv_price` | Required, positive decimal |
| `inv_miles` | Required, positive integer (no commas) |
| `inv_color` | Required, letters only |
| `classification_id` | Required, must be valid integer from select |

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `ejs` | Template engine |
| `express-ejs-layouts` | Layout support for EJS |
| `express-session` | Session management |
| `connect-flash` | Flash messages via session |
| `express-messages` | Render flash messages in views |
| `express-validator` | Server-side validation middleware |
| `pg` | PostgreSQL client |
| `dotenv` | Environment variable loading |
| `nodemon` (dev) | Auto-restart on file changes |

---

## 🚢 Deployment to Render.com

1. Push to GitHub
2. In Render dashboard: **New → Web Service**
3. Connect repository
4. Set environment variables:
   - `DATABASE_URL` → your PostgreSQL connection string
   - `SESSION_SECRET` → random secure string
   - `NODE_ENV` → `production`
5. Build command: `npm install`
6. Start command: `npm start`
7. Deploy and test all routes in production

---

*CSE 340 — Web Backend Development | Assignment 4* 