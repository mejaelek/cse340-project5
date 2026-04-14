const { Pool } = require('pg')
require('dotenv').config()

/* ─────────────────────────────────────────────
   Connection pool
   Reads from .env in development.
   On Render, environment variables are set
   directly in the dashboard — no .env needed.
───────────────────────────────────────────── */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }   // required by Render's PostgreSQL
        : false,
    max: 10,                // maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

/* ─────────────────────────────────────────────
   Test the connection on startup
───────────────────────────────────────────── */
pool.connect((err, client, release) => {
    if (err) {
        console.error('Database connection error:', err.stack)
    } else {
        console.log('Database connected successfully')
        release()
    }
})

/* ─────────────────────────────────────────────
   Graceful shutdown
───────────────────────────────────────────── */
process.on('SIGINT', async () => {
    await pool.end()
    console.log('Database pool has ended')
    process.exit(0)
})

module.exports = pool 