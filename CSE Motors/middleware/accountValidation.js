 // middleware/accountValidation.js
const { body, validationResult } = require('express-validator');
const accountModel = require('../models/accountModel');
const utilities = require('../utilities');

const validate = {};

/* **********************************
 * Update Account Validation Rules
 ********************************** */
validate.updateAccountRules = () => {
  return [
    body('account_firstname')
      .trim()
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters.')
      .matches(/^[A-Za-z]+$/)
      .withMessage('First name must contain only letters.'),

    body('account_lastname')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters.')
      .matches(/^[A-Za-z]+$/)
      .withMessage('Last name must contain only letters.'),

    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.')
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const account = await accountModel.getAccountById(account_id);
        
        // Only check if email is being changed
        if (account_email !== account.account_email) {
          const emailExists = await accountModel.checkExistingEmail(account_email);
          if (emailExists) {
            throw new Error('Email already exists. Please use a different email.');
          }
        }
      }),
  ];
};

/* **********************************
 * Check data and return errors or continue to update
 ********************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);
    
    res.render('account/update', {
      errors,
      title: 'Update Account',
      nav,
      accountData,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
    return;
  }
  next();
};

/* **********************************
 * Password Change Validation Rules
 ********************************** */
validate.changePasswordRules = () => {
  return [
    body('account_password')
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password must be at least 12 characters and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.'),
  ];
};

/* **********************************
 * Check password data and return errors or continue
 ********************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);
    
    res.render('account/update', {
      errors,
      title: 'Update Account',
      nav,
      accountData,
    });
    return;
  }
  next();
};

module.exports = validate;