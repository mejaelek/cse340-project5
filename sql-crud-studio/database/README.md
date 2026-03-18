 # SQL CRUD Studio — CSE 340 Assignment 2

## Project Overview
Complete PostgreSQL solution for Assignment 2 — Web Backend Development (CSE 340).

## Project Names (pick one)
- `sql-crud-studio` ← recommended
- `cse340-assignment2`
- `vehicle-inventory-db`
- `postgres-crud-workshop`

## File Structure
```
sql-crud-studio/
├── database/
│   ├── assignment2.sql        ← Task 1: 6 CRUD queries
│   └── database-rebuild.sql   ← Task 2: Full DB rebuild
├── index.html                 ← Interactive reference dashboard
└── README.md
```

## Task 1 — Queries in assignment2.sql
| # | Operation | Description |
|---|-----------|-------------|
| 1 | INSERT | Add Tony Stark to account table |
| 2 | UPDATE | Set Tony Stark's account_type to 'Admin' |
| 3 | DELETE | Remove Tony Stark record |
| 4 | UPDATE + REPLACE() | Fix GM Hummer description |
| 5 | SELECT + INNER JOIN | Get Sport category vehicles |
| 6 | UPDATE + REPLACE() | Fix all inventory image paths |

## Task 2 — Database Rebuild
Run `database/database-rebuild.sql` to:
1. Drop all existing tables and types
2. Create the `account_type` ENUM
3. Create `classification`, `account`, `inventory` tables
4. Insert sample data (5 classifications, 3 accounts, 11 vehicles)
5. Re-apply Task 1 transformations (queries 4 & 6)

## How to Use
1. Open `index.html` in a browser for the interactive reference
2. Copy queries from `assignment2.sql` into pgAdmin or SQLTools
3. Run `database-rebuild.sql` for Task 2 demonstration