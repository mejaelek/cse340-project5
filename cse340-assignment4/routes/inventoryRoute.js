/* ===================================================
   routes/inventoryRoute.js
   All routes for inventory management
   =================================================== */
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const validate = require("../utilities/inventory-validation");

/* ── Management View ────────────────────────────── */
router.get(
    "/",
    utilities.handleErrors(invController.buildManagement)
);

/* ── Classification View ─────────────────────────── */
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
);

/* ── Vehicle Detail View ─────────────────────────── */
router.get(
    "/detail/:inventoryId",
    utilities.handleErrors(invController.buildByInventoryId)
);

/* ── Add Classification (GET) ───────────────────── */
router.get(
    "/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
);

/* ── Add Classification (POST) ──────────────────── */
router.post(
    "/add-classification",
    validate.classificationRules(),
    utilities.handleErrors(validate.checkClassificationData),
    utilities.handleErrors(invController.addClassification)
);

/* ── Add Inventory (GET) ─────────────────────────── */
router.get(
    "/add-inventory",
    utilities.handleErrors(invController.buildAddInventory)
);

/* ── Add Inventory (POST) ────────────────────────── */
router.post(
    "/add-inventory",
    validate.inventoryRules(),
    utilities.handleErrors(validate.checkInventoryData),
    utilities.handleErrors(invController.addInventory)
);

module.exports = router;
