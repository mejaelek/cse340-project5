/* ===================================================
   routes/base.js — Base / Home Routes
   =================================================== */
const express = require("express");
const router = express.Router();
const baseController = require("../controllers/baseController");
const utilities = require("../utilities");

router.get("/", utilities.handleErrors(baseController.buildHome));
router.get("/error", utilities.handleErrors(baseController.buildError));

module.exports = router;
