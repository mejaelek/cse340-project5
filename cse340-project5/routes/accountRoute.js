/* ******************************************
 * routes/accountRoute.js
 * Account-related routes
 * ******************************************/
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

// -------- GET Routes --------

// Deliver Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Deliver Register View
router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister)
)

// Deliver Account Management View (requires login)
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
)

// Deliver Account Update View
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateView)
)

// Logout Route
router.get(
    "/logout",
    utilities.handleErrors(accountController.accountLogout)
)

// -------- POST Routes --------

// Process Login
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Process Registration
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process Account Information Update
router.post(
    "/update",
    utilities.checkLogin,
    regValidate.accountUpdateRules(),
    regValidate.checkAccountUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

// Process Password Change
router.post(
    "/update-password",
    utilities.checkLogin,
    regValidate.passwordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)
)

module.exports = router 