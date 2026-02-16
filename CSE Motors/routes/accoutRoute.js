 // routes/accountRoute.js
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');
const regValidate = require('../middleware/accountValidation');
const { checkJWTToken, checkAccountType } = require('../middleware/jwtMiddleware');

// Route to build login view
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build account management view (requires login)
router.get(
  '/management',
  checkJWTToken,
  utilities.handleErrors(accountController.buildManagement)
);

// Route to build account update view (requires login)
router.get(
  '/update/:account_id',
  checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateAccount)
);

// Process account information update
router.post(
  '/update',
  checkJWTToken,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password change
router.post(
  '/change-password',
  checkJWTToken,
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
);

// Process logout
router.get('/logout', utilities.handleErrors(accountController.logout));

module.exports = router;