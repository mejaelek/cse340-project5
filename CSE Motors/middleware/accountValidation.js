/* ***************************
* Account Validation Middleware
* Uses express-validator for validation
* ************************** */

const { body, validationResult } = require('express-validator');
const accountModel = require('../models/accountModel');
const utilities = require('../utilities');

const validate = {};

/* **********************************
 * Registration Validation Rules
 ********************************** */
validate.registrationRules = () => {
    return [
        // First name validation
        body('account_firstname')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a first name.')
            .isLength({ min: 2 })
            .withMessage('First name must be at least 2 characters.')
            .matches(/^[A-Za-z]+$/)
            .withMessage('First name can only contain letters.'),

        // Last name validation
        body('account_lastname')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a last name.')
            .isLength({ min: 2 })
            .withMessage('Last name must be at least 2 characters.')
            .matches(/^[A-Za-z]+$/)
            .withMessage('Last name can only contain letters.'),

        // Email validation
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide an email address.')
            .isEmail()
            .withMessage('A valid email is required.')
            .normalizeEmail()
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email);
                if (emailExists) {
                    throw new Error('Email already exists. Please log in or use different email.');
                }
            }),

        // Password validation
        body('account_password')
            .trim()
            .notEmpty()
            .withMessage('Please provide a password.')
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Password does not meet requirements.'),
    ];
};

/* **********************************
 * Check Registration Data
 * Returns errors or continues to next middleware
 ********************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = [];
    errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/register', {
            errors,
            title: 'Register',
            nav,
            account_firstname,
            account_lastname,
            account_email,
        });
        return;
    }
    next();
};

/* **********************************
 * Login Validation Rules
 ********************************** */
validate.loginRules = () => {
    return [
        // Email validation
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide an email address.')
            .isEmail()
            .withMessage('A valid email is required.')
            .normalizeEmail(),

        // Password validation
        body('account_password')
            .trim()
            .notEmpty()
            .withMessage('Password is required.'),
    ];
};

/* **********************************
 * Check Login Data
 * Returns errors or continues to next middleware
 ********************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body;
    let errors = [];
    errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/login', {
            errors,
            title: 'Login',
            nav,
            account_email,
        });
        return;
    }
    next();
};

/* **********************************
 * Update Account Validation Rules
 ********************************** */
validate.updateAccountRules = () => {
    return [
        // First name validation
        body('account_firstname')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a first name.')
            .isLength({ min: 2 })
            .withMessage('First name must be at least 2 characters.')
            .matches(/^[A-Za-z]+$/)
            .withMessage('First name can only contain letters.'),

        // Last name validation
        body('account_lastname')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide a last name.')
            .isLength({ min: 2 })
            .withMessage('Last name must be at least 2 characters.')
            .matches(/^[A-Za-z]+$/)
            .withMessage('Last name can only contain letters.'),

        // Email validation
        body('account_email')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Please provide an email address.')
            .isEmail()
            .withMessage('A valid email is required.')
            .normalizeEmail()
            .custom(async (account_email, { req }) => {
                const account_id = req.body.account_id;
                const account = await accountModel.getAccountById(account_id);

                // Only check if email is being changed
                if (account && account_email !== account.account_email) {
                    const emailExists = await accountModel.checkExistingEmail(account_email);
                    if (emailExists) {
                        throw new Error('Email already exists. Please use a different email.');
                    }
                }
            }),
    ];
};

/* **********************************
 * Check Update Data
 * Returns errors or continues to next middleware
 ********************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    let errors = [];
    errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const accountData = await accountModel.getAccountById(account_id);

        res.render('account/update', {
            errors,
            title: 'Update Account',
            nav,
            accountData,
            account_firstname,
            account_lastname,
            account_email,
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
        // Password validation
        body('account_password')
            .trim()
            .notEmpty()
            .withMessage('Please provide a password.')
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Password does not meet requirements.'),
    ];
};

/* **********************************
 * Check Password Change Data
 * Returns errors or continues to next middleware
 ********************************** */
validate.checkPasswordData = async (req, res, next) => {
    const { account_id } = req.body;
    let errors = [];
    errors = validationResult(req);

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