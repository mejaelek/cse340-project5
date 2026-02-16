// routes/inventoryRoute.js
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');
const { checkAccountType } = require('../middleware/jwtMiddleware');

// Route to build inventory management view (requires Employee or Admin)
router.get(
    '/',
    checkAccountType,
    utilities.handleErrors(invController.buildManagement)
);

// Route to add new classification (requires Employee or Admin)
router.get(
    '/add-classification',
    checkAccountType,
    utilities.handleErrors(invController.buildAddClassification)
);

// Process add classification (requires Employee or Admin)
router.post(
    '/add-classification',
    checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to add new vehicle (requires Employee or Admin)
router.get(
    '/add-inventory',
    checkAccountType,
    utilities.handleErrors(invController.buildAddInventory)
);

// Process add vehicle (requires Employee or Admin)
router.post(
    '/add-inventory',
    checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// Route to edit vehicle (requires Employee or Admin)
router.get(
    '/edit/:inv_id',
    checkAccountType,
    utilities.handleErrors(invController.buildEditInventory)
);

// Process edit vehicle (requires Employee or Admin)
router.post(
    '/update',
    checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// Route to delete vehicle (requires Employee or Admin)
router.get(
    '/delete/:inv_id',
    checkAccountType,
    utilities.handleErrors(invController.buildDeleteInventory)
);

// Process delete vehicle (requires Employee or Admin)
router.post(
    '/delete',
    checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
);

// Public routes (no authorization required)
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));
router.get('/detail/:invId', utilities.handleErrors(invController.buildByInvId));

module.exports = router; 