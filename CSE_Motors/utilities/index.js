const invModel = require("../models/inventory-model")

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach((vehicle) => {
            grid += "<li>"
            grid +=
                '<a href="../../inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' details"><img src="' +
                vehicle.inv_thumbnail +
                '" alt="Image of ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += "<hr />"
            grid += "<h2>"
            grid +=
                '<a href="../../inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' details">' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                "</a>"
            grid += "</h2>"
            grid +=
                "<span>$" +
                new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
                "</span>"
            grid += "</div>"
            grid += "</li>"
        })
        grid += "</ul>"
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
 * Build the vehicle detail view HTML
 * Wraps a single vehicle's data in full HTML markup
 * ************************************ */
Util.buildVehicleDetail = function (vehicle) {
    let detail = ""

    // Format price as US dollars with commas and $ symbol
    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(vehicle.inv_price)

    // Format mileage with commas
    const formattedMileage = new Intl.NumberFormat("en-US").format(
        vehicle.inv_miles
    )

    detail += '<div id="vehicle-detail-wrapper">'

    // Left column - full size image
    detail += '<div id="vehicle-image-col">'
    detail +=
        '<img src="' +
        vehicle.inv_image +
        '" alt="Full size image of ' +
        vehicle.inv_year +
        " " +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        '" id="vehicle-full-img" />'
    detail += "</div>"

    // Right column - vehicle info
    detail += '<div id="vehicle-info-col">'

    // Price banner
    detail += '<div id="vehicle-price-banner">'
    detail += "<p>Price</p>"
    detail += "<h2>" + formattedPrice + "</h2>"
    detail += "</div>"

    // Key specs grid
    detail += '<div class="vehicle-specs-grid">'
    detail += '<div class="spec-item"><span class="spec-label">Make</span><span class="spec-value">' + vehicle.inv_make + "</span></div>"
    detail += '<div class="spec-item"><span class="spec-label">Model</span><span class="spec-value">' + vehicle.inv_model + "</span></div>"
    detail += '<div class="spec-item"><span class="spec-label">Year</span><span class="spec-value">' + vehicle.inv_year + "</span></div>"
    detail += '<div class="spec-item"><span class="spec-label">Color</span><span class="spec-value">' + vehicle.inv_color + "</span></div>"
    detail += '<div class="spec-item"><span class="spec-label">Mileage</span><span class="spec-value">' + formattedMileage + " miles</span></div>"
    detail += '<div class="spec-item"><span class="spec-label">Price</span><span class="spec-value">' + formattedPrice + "</span></div>"
    detail += "</div>"

    // Description
    detail += '<div id="vehicle-description">'
    detail += "<h3>Description</h3>"
    detail += "<p>" + vehicle.inv_description + "</p>"
    detail += "</div>"

    detail += "</div>" // close vehicle-info-col
    detail += "</div>" // close vehicle-detail-wrapper

    return detail
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for
 * Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util 