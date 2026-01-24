const express = require('express')
const router = new express.Router()
const invController = require('../controllers/invController')

// Route to build vehicle detail view
router.get('/detail/:invId', invController.buildVehicleDetail)

// Route to trigger intentional error
router.get('/trigger-error', invController.triggerError)

module.exports = router
