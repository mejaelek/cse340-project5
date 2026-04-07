/* ******************************************
 * routes/inventoryRoute.js
 * Inventory-related routes
 * Protected admin routes use checkAccountType
 * ******************************************/
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// -------- PUBLIC Routes (no auth needed) --------

// Classification view - public
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail view - public
router.get(
    "/detail/:inv_id",
    utilities.handleErrors(invController.buildByInvId)
)

// -------- PROTECTED Routes (Employee/Admin only) --------

// Inventory Management View
router.get(
    "/",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagementView)
)

// Add Classification View
router.get(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddClassification)
)

// Add Inventory View
router.get(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddInventory)
)

// Get inventory as JSON (for management table)
router.get(
    "/getInventory/:classification_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON)
)

// Edit inventory view
router.get(
    "/edit/:inv_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildEditInventoryView)
)

// Delete inventory confirmation view
router.get(
    "/delete/:inv_id",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteConfirmView)
)

// Process add classification
router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Process add inventory
router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory)
)

// Process update inventory
router.post(
    "/update/",
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Process delete inventory
router.post(
    "/delete/",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router 