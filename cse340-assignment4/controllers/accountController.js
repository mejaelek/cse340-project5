/* ===================================================
   controllers/accountController.js — Stub
   =================================================== */
const utilities = require("../utilities");

const accountCont = {};

accountCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    });
};

accountCont.buildRegister = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    });
};

module.exports = accountCont;
