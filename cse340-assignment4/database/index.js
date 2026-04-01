/* ===================================================
   database/index.js — PostgreSQL Connection Pool
   =================================================== */
const { Pool } = require("pg");

let pool;

if (process.env.NODE_ENV === "development") {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: false,
    });

    // Log queries in dev
    const originalQuery = pool.query.bind(pool);
    pool.query = (...args) => {
        if (typeof args[0] === "string") {
            console.log("🔷 SQL:", args[0].trim().substring(0, 120));
        }
        return originalQuery(...args);
    };
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });
}

module.exports = pool;
