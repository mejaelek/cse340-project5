const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>";
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>";
        list += "</li>";
    });
    list += "</ul>";
    return list;
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid;
    if (data.length > 0) {
        grid = '<ul id="inv-display">';
        data.forEach(vehicle => {
            grid += '<li>';
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>';
            grid += '<div class="namePrice">';
            grid += '<hr />';
            grid += '<h2>';
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
            grid += '</h2>';
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
            grid += '</div>';
            grid += '</li>';
        });
        grid += '</ul>';
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
};

/* **************************************
* Build the detail view HTML for a specific vehicle
* ************************************ */
Util.buildDetailView = async function (vehicle) {
    if (!vehicle) {
        return '<p class="notice">Sorry, that vehicle could not be found.</p>';
    }

    let detailHTML = '<div class="vehicle-detail">';

    // Image section
    detailHTML += '<div class="vehicle-image">';
    detailHTML += '<img src="' + vehicle.inv_image + '" alt="' + vehicle.inv_make + ' ' + vehicle.inv_model + '">';
    detailHTML += '</div>';

    // Details section
    detailHTML += '<div class="vehicle-info">';

    // Price - prominent
    detailHTML += '<div class="vehicle-price">';
    detailHTML += '<h2>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h2>';
    detailHTML += '</div>';

    // Key details
    detailHTML += '<div class="vehicle-specs">';

    detailHTML += '<div class="spec-item">';
    detailHTML += '<span class="spec-label">Year:</span>';
    detailHTML += '<span class="spec-value">' + vehicle.inv_year + '</span>';
    detailHTML += '</div>';

    detailHTML += '<div class="spec-item">';
    detailHTML += '<span class="spec-label">Make:</span>';
    detailHTML += '<span class="spec-value">' + vehicle.inv_make + '</span>';
    detailHTML += '</div>';

    detailHTML += '<div class="spec-item">';
    detailHTML += '<span class="spec-label">Model:</span>';
    detailHTML += '<span class="spec-value">' + vehicle.inv_model + '</span>';
    detailHTML += '</div>';

    detailHTML += '<div class="spec-item">';
    detailHTML += '<span class="spec-label">Mileage:</span>';
    detailHTML += '<span class="spec-value">' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</span>';
    detailHTML += '</div>';

    detailHTML += '<div class="spec-item">';
    detailHTML += '<span class="spec-label">Color:</span>';
    detailHTML += '<span class="spec-value">' + vehicle.inv_color + '</span>';
    detailHTML += '</div>';

    detailHTML += '</div>'; // Close vehicle-specs

    // Description
    detailHTML += '<div class="vehicle-description">';
    detailHTML += '<h3>Description</h3>';
    detailHTML += '<p>' + vehicle.inv_description + '</p>';
    detailHTML += '</div>';

    detailHTML += '</div>'; // Close vehicle-info
    detailHTML += '</div>'; // Close vehicle-detail

    return detailHTML;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;