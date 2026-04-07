/* ******************************************
 * controllers/invController.js
 * Inventory management controller
 * ******************************************/
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
    const className = data[0]?.classification_name || "Unknown"
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryById(inv_id)
    const detail = await utilities.buildVehicleDetail(data)
    let nav = await utilities.getNav()
    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
    res.render("./inventory/detail", {
        title: vehicleName,
        nav,
        detail,
    })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
        classificationSelect,
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body
    const addResult = await invModel.addClassification(classification_name)
    let nav = await utilities.getNav()

    if (addResult) {
        req.flash(
            "notice",
            `The "${classification_name}" classification was successfully added.`
        )
        const classificationSelect = await utilities.buildClassificationList()
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
            classificationSelect,
        })
    } else {
        req.flash("notice", "Sorry, adding the classification failed.")
        res.status(501).render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
            classification_name,
        })
    }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationList,
        errors: null,
    })
}

/* ***************************
 *  Process add inventory item
 * ************************** */
invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id,
    } = req.body

    const addResult = await invModel.addInventory(
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id
    )

    if (addResult) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully added to the inventory.`
        )
        const classificationSelect = await utilities.buildClassificationList()
        res.status(201).render("inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
            classificationSelect,
        })
    } else {
        req.flash("notice", "Sorry, adding the vehicle failed.")
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.status(501).render("inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
            classificationList,
            errors: null,
            inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price, inv_miles,
            inv_color, classification_id,
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0]?.inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    let classificationList = await utilities.buildClassificationList(
        itemData.classification_id
    )
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList,
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
    })
}

/* ***************************
 *  Process update inventory
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id, inv_make, inv_model, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_year,
        inv_miles, inv_color, classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
        parseInt(inv_id), inv_make, inv_model, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_year,
        inv_miles, inv_color, classification_id
    )

    if (updateResult) {
        const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
        req.flash("notice", `The ${itemName} was successfully updated.`)
        const classificationSelect = await utilities.buildClassificationList()
        res.redirect("/inv/")
    } else {
        let classificationList = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationList,
            errors: null,
            inv_id: parseInt(inv_id), inv_make, inv_model, inv_year, inv_description,
            inv_image, inv_thumbnail, inv_price: parseInt(inv_price),
            inv_miles: parseInt(inv_miles), inv_color, classification_id,
        })
    }
}

/* ***************************
 *  Build delete inventory confirmation view
 * ************************** */
invCont.buildDeleteConfirmView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
    })
}

/* ***************************
 *  Process delete inventory item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)
    if (deleteResult) {
        req.flash("notice", "The vehicle was successfully deleted.")
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        res.redirect(`/inv/delete/${inv_id}`)
    }
}

module.exports = invCont 