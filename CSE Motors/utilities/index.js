// utilities/index.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************ */
Util.getNav = async function (req, res, next) {
    // Your existing navigation code here
    // This should return the navigation HTML
};

/* **************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 ************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util; 