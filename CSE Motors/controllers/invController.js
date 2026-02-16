/* ***************************
* Inventory Controller
* Unit 3, deliver classification view
* Unit 4, deliver vehicle detail view
* Unit 5, add classification and inventory
* ************************** */

const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0] ? data[0].classification_name : 'Classification';
    res.render('./inventory/classification', {
        title: className + ' vehicles',
        nav,
        grid,
    });
};

/* ***************************
 * Build vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId;
    const data = await invModel.getVehicleByInvId(inv_id);
    const vehicle = await utilities.buildDetailView(data);
    let nav = await utilities.getNav();
    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
    res.render('./inventory/detail', {
        title: vehicleName,
        nav,
        vehicle,
        classification_id: data.classification_id,
    });
};

/* ***************************
 * Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render('./inventory/management', {
        title: 'Vehicle Management',
        nav,
        errors: null,
        classificationSelect,
    });
};

/* ***************************
 * Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render('./inventory/add-classification', {
        title: 'Add New Classification',
        nav,
        errors: null,
    });
};

/* ***************************
 * Process add classification
 * ************************** */
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;

    const addResult = await invModel.addClassification(classification_name);

    if (addResult) {
        req.flash(
            'notice',
            `The ${classification_name} classification was successfully added.`
        );
        res.status(201).render('./inventory/management', {
            title: 'Vehicle Management',
            nav,
            errors: null,
            classificationSelect: await utilities.buildClassificationList(),
        });
    } else {
        req.flash('notice', 'Sorry, adding the classification failed.');
        res.status(501).render('./inventory/add-classification', {
            title: 'Add New Classification',
            nav,
            errors: null,
        });
    }
};

/* ***************************
 * Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render('./inventory/add-inventory', {
        title: 'Add New Vehicle',
        nav,
        classificationList,
        errors: null,
    });
};

/* ***************************
 * Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();

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

    const addResult = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    );

    if (addResult) {
        req.flash(
            'notice',
            `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`
        );
        res.status(201).render('./inventory/management', {
            title: 'Vehicle Management',
            nav,
            errors: null,
            classificationSelect: await utilities.buildClassificationList(),
        });
    } else {
        req.flash('notice', 'Sorry, adding the vehicle failed.');
        res.status(501).render('./inventory/add-inventory', {
            title: 'Add New Vehicle',
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

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (invData[0].inv_id) {
        return res.json(invData);
    } else {
        next(new Error('No data returned'));
    }
};

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleByInvId(inv_id);
    const classificationList = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render('./inventory/edit-inventory', {
        title: 'Edit ' + itemName,
        nav,
        classificationList: classificationList,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id,
    });
};

/* ***************************
 * Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body;

    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    );

    if (updateResult) {
        const itemName = updateResult.inv_make + ' ' + updateResult.inv_model;
        req.flash('notice', `The ${itemName} was successfully updated.`);
        res.redirect('/inv/');
    } else {
        const classificationList = await utilities.buildClassificationList(classification_id);
        const itemName = `${inv_make} ${inv_model}`;
        req.flash('notice', 'Sorry, the update failed.');
        res.status(501).render('inventory/edit-inventory', {
            title: 'Edit ' + itemName,
            nav,
            classificationList: classificationList,
            errors: null,
            inv_id,
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

/* ***************************
 * Build delete confirmation view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleByInvId(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render('./inventory/delete-confirm', {
        title: 'Delete ' + itemName,
        nav,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        inv_description: itemData.inv_description,
    });
};

/* ***************************
 * Process Delete Inventory
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;
    const inv_id_number = parseInt(inv_id);

    const deleteResult = await invModel.deleteInventoryItem(inv_id_number);

    if (deleteResult) {
        const itemName = `${inv_year} ${inv_make} ${inv_model}`;
        req.flash('notice', `The ${itemName} was successfully deleted.`);
        res.redirect('/inv/');
    } else {
        const itemName = `${inv_year} ${inv_make} ${inv_model}`;
        req.flash('notice', 'Sorry, the delete failed.');
        res.status(501).render('./inventory/delete-confirm', {
            title: 'Delete ' + itemName,
            nav,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
        });
    }
};

module.exports = invCont;