/* ******************************************
* routes/static.js
* Static routes for CSE Motors
*******************************************/
const express = require("express");
const router = express.Router();
const baseController = require("../controllers/baseController");

/* ***********************
 * Home Route
 *************************/
router.get("/", baseController.buildHome);

module.exports = router;