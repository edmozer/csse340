const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities')

// Management routes (protected - Employee/Admin only)
router.get('/', utilities.checkAccountType, utilities.handleErrors(invController.buildManagement))

// Add classification routes (protected - Employee/Admin only)
router.get('/add-classification', utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))
router.post(
  '/add-classification',
  utilities.checkAccountType,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory routes (protected - Employee/Admin only)
router.get('/add-inventory', utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))
router.post(
  '/add-inventory',
  utilities.checkAccountType,
  utilities.handleErrors(invController.addInventory)
)

// Route to build inventory by classification view (public)
router.get('/type/:classificationName', utilities.handleErrors(invController.buildInventoryByClassification))

// Route to build vehicle detail view (public)
router.get('/detail/:invId', utilities.handleErrors(invController.buildVehicleDetail))

// Route to trigger intentional error
router.get('/trigger-error', utilities.handleErrors(invController.triggerError))

module.exports = router
