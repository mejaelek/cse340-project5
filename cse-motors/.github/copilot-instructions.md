# CSE Motors - AI Coding Agent Instructions

## Architecture Overview
This is an Express.js MVC web application for vehicle inventory management using PostgreSQL. The app follows a pattern where controllers fetch data via models, then use utility functions to build HTML strings that are passed to EJS templates.

**Key Components:**
- `server.js`: Main app setup with middleware, routes, and error handling
- `controllers/`: Handle requests, coordinate between models and views
- `models/`: Database queries (PostgreSQL via pg pool)
- `utilities/`: HTML builders and shared functions like navigation
- `routes/`: Route definitions with error handling wrappers
- `views/`: EJS templates with layout system

## Critical Patterns

### Data Flow Pattern
```javascript
// Controller pattern - models get data, utilities build HTML
const data = await invModel.getInventoryByClassificationId(classification_id);
const grid = await utilities.buildClassificationGrid(data);
res.render("./inventory/classification", { title, nav, grid });
```

### Error Handling
- Wrap route handlers with `utilities.handleErrors()` for automatic error catching
- Models use try/catch for database operations
- Errors bubble to Express error handler in `server.js`

### HTML Building Convention
- Use utility functions to build HTML strings instead of passing data to templates
- Example: `utilities.buildClassificationGrid()` returns complete `<ul>` markup
- Templates receive pre-rendered HTML via variables like `grid`, `detailHTML`

### Navigation System
- Dynamic nav built from `classification` table via `utilities.getNav()`
- Called on every request to ensure current classifications are shown

## Database Schema
- `classification`: Vehicle categories (Custom, Sport, SUV, etc.)
- `inventory`: Vehicle details with foreign key to classification
- Session table created automatically by connect-pg-simple

## Development Workflow
- `npm run dev`: Uses nodemon for auto-restart
- Database setup: Run `configuration/setup.sql` to create tables and sample data
- Environment: Requires `.env` with `DATABASE_URL`, `SESSION_SECRET`, `HOST`, `PORT`

## Key Files to Reference
- `utilities/index.js`: Core HTML builders and error handling
- `models/inventory-model.js`: Database query patterns
- `server.js`: Middleware setup and route mounting
- `configuration/setup.sql`: Database schema and sample data

## Common Tasks
- Adding new vehicle views: Create controller method → add route → build HTML in utilities → create EJS template
- Database changes: Update model functions → modify setup.sql if schema changes
- New classifications: Automatically appear in nav after DB insertion

## Environment Setup
Requires PostgreSQL database. In development, SSL is disabled for local testing. Session store creates its own table automatically.