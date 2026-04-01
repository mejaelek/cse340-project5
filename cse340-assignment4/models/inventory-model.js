/* ===================================================
   models/inventory-model.js
   All database operations for inventory & classification
   =================================================== */
const pool = require("../database");

/* ── Get All Classifications ────────────────────── */
async function getClassifications() {
    return await pool.query(
        "SELECT * FROM classification ORDER BY classification_name"
    );
}

/* ── Get Inventory by Classification ID ─────────── */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT i.*, c.classification_name
         FROM inventory i
         JOIN classification c ON i.classification_id = c.classification_id
        WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getInventoryByClassificationId error:", error);
        throw error;
    }
}

/* ── Get Single Inventory Item ──────────────────── */
async function getInventoryById(inv_id) {
    try {
        const data = await pool.query(
            `SELECT i.*, c.classification_name
         FROM inventory i
         JOIN classification c ON i.classification_id = c.classification_id
        WHERE i.inv_id = $1`,
            [inv_id]
        );
        return data.rows[0];
    } catch (error) {
        console.error("getInventoryById error:", error);
        throw error;
    }
}

/* ── Add New Classification ─────────────────────── */
async function addClassification(classification_name) {
    try {
        const sql =
            "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
        return await pool.query(sql, [classification_name]);
    } catch (error) {
        console.error("addClassification error:", error);
        throw error;
    }
}

/* ── Add New Inventory Item ─────────────────────── */
async function addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql = `
      INSERT INTO inventory
        (inv_make, inv_model, inv_year, inv_description,
         inv_image, inv_thumbnail, inv_price, inv_miles,
         inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`;
        return await pool.query(sql, [
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        ]);
    } catch (error) {
        console.error("addInventory error:", error);
        throw error;
    }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getInventoryById,
    addClassification,
    addInventory,
};
