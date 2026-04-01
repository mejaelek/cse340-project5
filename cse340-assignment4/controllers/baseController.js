/* ===================================================
   controllers/baseController.js
   =================================================== */
const utilities = require("../utilities");

const baseCont = {};

baseCont.buildHome = async function (req, res, next) {
    const nav = await utilities.getNav();
    res.render("index", {
        title: "Home",
        nav,
        errors: null,
    });
};

// Trigger intentional 500 error (for testing error handler)
baseCont.buildError = async function (req, res, next) {
    throw new Error("Intentional 500 Error Triggered");
};

module.exports = baseCont;
