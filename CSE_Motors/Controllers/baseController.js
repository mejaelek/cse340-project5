const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res, next) {
    const nav = await utilities.getNav()
    res.render("index", {
        title: "Home",
        nav,
    })
}

/* ***********************
 * Task 3 — Intentional 500-type error
 * Throws an exception which the error middleware will catch
 *********************** */
baseController.triggerError = async function (req, res, next) {
    // Intentionally throw a 500-level error
    throw new Error(
        "Intentional Server Error — This was triggered from the footer link."
    )
}

module.exports = baseController 