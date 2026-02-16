// middleware/jwtMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ****************************************
 * Check JWT Token Validity
 **************************************** */
function checkJWTToken(req, res, next) {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash('notice', 'Please log in');
                    res.clearCookie('jwt');
                    return res.redirect('/account/login');
                }
                res.locals.accountData = accountData;
                res.locals.loggedin = 1;
                next();
            }
        );
    } else {
        req.flash('notice', 'Please log in');
        return res.redirect('/account/login');
    }
}

/* ****************************************
 * Check Account Type for Authorization
 * Allows only Employee or Admin
 **************************************** */
function checkAccountType(req, res, next) {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash('notice', 'Please log in');
                    res.clearCookie('jwt');
                    return res.redirect('/account/login');
                }

                // Check if account type is Employee or Admin
                if (accountData.account_type === 'Employee' || accountData.account_type === 'Admin') {
                    res.locals.accountData = accountData;
                    res.locals.loggedin = 1;
                    next();
                } else {
                    req.flash('notice', 'Access denied. You do not have permission to access this resource.');
                    return res.redirect('/account/login');
                }
            }
        );
    } else {
        req.flash('notice', 'Please log in');
        return res.redirect('/account/login');
    }
}

/* ****************************************
 * Check Login Status (doesn't require login)
 * Used to set res.locals for conditional rendering
 **************************************** */
function checkLogin(req, res, next) {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    res.locals.loggedin = 0;
                    next();
                } else {
                    res.locals.accountData = accountData;
                    res.locals.loggedin = 1;
                    next();
                }
            }
        );
    } else {
        res.locals.loggedin = 0;
        next();
    }
}

module.exports = { checkJWTToken, checkAccountType, checkLogin };