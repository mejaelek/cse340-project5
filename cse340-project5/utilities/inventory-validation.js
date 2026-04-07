/* ******************************************
 * utilities/inventory-validation.js
 * Server-side validation for inventory routes
 * ******************************************/
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlphanumeric()
            .withMessage(
                "Classification name is required and must contain only letters and numbers (no spaces or special characters)."
            ),
    ]
}

/* ******************************
 * Check classification data
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
 *  Inventory Item Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make").trim().escape().notEmpty().withMessage("Make is required."),
        body("inv_model").trim().escape().notEmpty().withMessage("Model is required."),
        body("inv_year")
            .trim()
            .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
            .withMessage("A valid 4-digit year is required."),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Description is required."),
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path is required."),
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required."),
        body("inv_price")
            .trim()
            .isDecimal()
            .withMessage("A valid price is required."),
        body("inv_miles")
            .trim()
            .isInt({ min: 0 })
            .withMessage("Valid mileage is required."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Color is required."),
        body("classification_id")
            .trim()
            .isInt({ min: 1 })
            .withMessage("A classification must be selected."),
    ]
}

/* ******************************
 * Check inventory data (add)
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const {
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id,
    } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Vehicle",
            nav,
            classificationList,
            inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price, inv_miles,
            inv_color, classification_id,
        })
        return
    }
    next()
}

/* ******************************
 * Check inventory data (edit/update)
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const {
        inv_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id,
    } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/edit-inventory", {
            errors,
            title: `Edit ${inv_make} ${inv_model}`,
            nav,
            classificationList,
            inv_id: parseInt(inv_id),
            inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price: parseInt(inv_price),
            inv_miles: parseInt(inv_miles), inv_color, classification_id,
        })
        return
    }
    next()
}

module.exports = validate 