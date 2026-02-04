const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')
const utilities = require('../utilities')
const validate = require('../middleware/inventory-validation')

// Management routes
router.get('/', utilities.handleErrors(invController.buildManagement))

// Add classification routes
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification))
router.post(
  '/add-classification',
  validate.validateClassification,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory routes
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory))
router.post(
  '/add-inventory',
  validate.validateInventory,
  utilities.handleErrors(invController.addInventory)
)

// Route to build inventory by classification view
router.get('/type/:classificationName', utilities.handleErrors(invController.buildInventoryByClassification))

// Route to build inventory by classification view
router.get('/type/:classificationName', invController.buildInventoryByClassification)

// Route to build vehicle detail view
router.get('/detail/:invId', utilities.handleErrors(invController.buildVehicleDetail))

// Route to trigger intentional error
router.get('/trigger-error', utilities.handleErrors(invController.triggerError))

module.exports = router
