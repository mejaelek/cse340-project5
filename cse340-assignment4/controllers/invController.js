/* ===================================================
   controllers/invController.js
   All controller logic for inventory & classification
   =================================================== */
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ── Management View ────────────────────────────── */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
    });
};

/* ── Classification View (by type) ─────────────── */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0]?.classification_name ?? "Vehicles";
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors: null,
    });
};

/* ── Vehicle Detail View ─────────────────────────── */
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId;
    const vehicle = await invModel.getInventoryById(inv_id);
    if (!vehicle) {
        return next({ status: 404, message: "Vehicle not found." });
    }
    const detail = utilities.buildVehicleDetail(vehicle);
    let nav = await utilities.getNav();
    const title = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
    res.render("./inventory/detail", {
        title,
        nav,
        detail,
        errors: null,
    });
};

/* ── Add Classification View (GET) ──────────────── */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        classification_name: "",
    });
};

/* ── Process New Classification (POST) ──────────── */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);

    if (result.rowCount > 0) {
        // Rebuild nav so new classification appears immediately
        let nav = await utilities.getNav();
        req.flash(
            "success",
            `✅ Classification "${classification_name}" was added successfully.`
        );
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, the classification could not be added.");
        let nav = await utilities.getNav();
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
            classification_name,
        });
    }
};

/* ── Add Inventory View (GET) ───────────────────── */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationList,
        errors: null,
        // Default empty values for sticky form
        inv_make: "",
        inv_model: "",
        inv_year: "",
        inv_description: "",
        inv_image: "/images/vehicles/no-image.png",
        inv_thumbnail: "/images/vehicles/no-image-tn.png",
        inv_price: "",
        inv_miles: "",
        inv_color: "",
        classification_id: null,
    });
};

/* ── Process New Inventory (POST) ───────────────── */
invCont.addInventory = async function (req, res, next) {
    let {
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

    const result = await invModel.addInventory(
        inv_make,
        inv_model,
        parseInt(inv_year),
        inv_description,
        inv_image,
        inv_thumbnail,
        parseFloat(inv_price),
        parseInt(inv_miles),
        inv_color,
        parseInt(classification_id)
    );

    if (result.rowCount > 0) {
        let nav = await utilities.getNav();
        req.flash(
            "success",
            `✅ ${inv_year} ${inv_make} ${inv_model} was added to the inventory.`
        );
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, the vehicle could not be added.");
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList(
            classification_id
        );
        res.status(501).render("inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
            classificationList,
            errors: null,
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
};

module.exports = invCont;
