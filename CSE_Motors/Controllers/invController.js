const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory detail view — Task 1
 *  A single view that accepts any vehicle via inv_id parameter
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const vehicle = await invModel.getInventoryByInvId(inv_id)

    if (!vehicle) {
        // If no vehicle found, trigger 404 via next
        next({ status: 404, message: "That vehicle could not be found." })
        return
    }

    const vehicleDetail = utilities.buildVehicleDetail(vehicle)
    let nav = await utilities.getNav()

    res.render("./inventory/detail", {
        title: vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model,
        nav,
        vehicleDetail,
    })
}

module.exports = invCont 