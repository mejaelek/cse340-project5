/* ===================================================
   models/account-model.js — Stub for future use
   =================================================== */
const pool = require("../database");

async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            "SELECT * FROM account WHERE account_email = $1",
            [account_email]
        );
        return result.rows[0];
    } catch (error) {
        console.error("getAccountByEmail error:", error);
        throw error;
    }
}

module.exports = { getAccountByEmail };
