/* ===================================================
   utilities/inventory-validation.js
   Server-side validation rules for classification
   and inventory forms using express-validator
   =================================================== */
const { body, validationResult } = require("express-validator");
const utilities = require(".");

const validate = {};

/* ── Classification Validation Rules ────────────── */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("Classification name is required.")
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage(
                "Classification name must contain only letters and numbers — no spaces or special characters."
            ),
    ];
};

/* ── Check Classification Data ──────────────────── */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        req.flash(
            "notice",
            "Please correct the errors below before submitting."
        );
        return res.status(400).render("inventory/add-classification", {
            errors: errors.array(),
            title: "Add Classification",
            nav,
            classification_name,
        });
    }
    next();
};

/* ── Inventory Validation Rules ─────────────────── */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Make is required.")
            .isLength({ min: 2, max: 50 })
            .withMessage("Make must be between 2 and 50 characters."),

        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Model is required.")
            .isLength({ min: 1, max: 50 })
            .withMessage("Model must be between 1 and 50 characters."),

        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Year is required.")
            .isInt({ min: 1900, max: 9999 })
            .withMessage("Year must be a valid 4-digit year (1900–9999)."),

        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required.")
            .isLength({ min: 10 })
            .withMessage("Description must be at least 10 characters."),

        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path is required.")
            .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
            .withMessage("Image must be a valid image path (.jpg, .png, .gif, etc.)"),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required.")
            .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
            .withMessage("Thumbnail must be a valid image path."),

        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Price is required.")
            .isDecimal({ decimal_digits: "0,2" })
            .withMessage("Price must be a valid number (e.g. 25000 or 25000.99).")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Mileage is required.")
            .isInt({ min: 0 })
            .withMessage("Mileage must be a whole number with no commas or spaces."),

        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required.")
            .isAlpha()
            .withMessage("Color must contain only letters."),

        body("classification_id")
            .notEmpty()
            .withMessage("Please select a classification.")
            .isInt()
            .withMessage("A valid classification must be selected."),
    ];
};

/* ── Check Inventory Data ───────────────────────── */
validate.checkInventoryData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList(
            classification_id
        );
        req.flash(
            "notice",
            "Please correct the errors below before submitting."
        );
        return res.status(400).render("inventory/add-inventory", {
            errors: errors.array(),
            title: "Add Vehicle",
            nav,
            classificationList,
            // Sticky values
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        });
    }
    next();
};

module.exports = validate;
