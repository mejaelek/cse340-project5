const express = require("express")
const router = new express.Router()
const baseController = require("../controllers/baseController")
const utilities = require("../utilities/")

// Route to build home view
router.get("/", utilities.handleErrors(baseController.buildHome))

// Intentional error route — Task 3
router.get(
    "/error",
    utilities.handleErrors(baseController.triggerError)
)

module.exports = router 