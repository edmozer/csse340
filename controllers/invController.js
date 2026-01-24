const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildInventoryByClassification = async function (req, res, next) {
  try {
    const classificationName = req.params.classificationName
    const data = await invModel.getInventoryByClassification(classificationName)

    if (!data || data.length === 0) {
      const err = new Error('No vehicles found for this classification')
      err.status = 404
      return next(err)
    }

    const grid = utilities.buildInventoryGrid(data)
    const title = `${classificationName} Vehicles`

    res.render('inventory/classification', {
      title,
      grid,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const vehicle = await invModel.getVehicleById(invId)
    
    if (!vehicle) {
      const err = new Error('Vehicle not found')
      err.status = 404
      return next(err)
    }

    const vehicleHTML = utilities.buildVehicleDetailHTML(vehicle)
    const title = `${vehicle.inv_year || ''} ${vehicle.inv_make} ${vehicle.inv_model}`
    
    res.render('inventory/detail', {
      title: title,
      vehicleHTML: vehicleHTML,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Trigger intentional 500 error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  const error = new Error('Intentional server error for testing')
  error.status = 500
  next(error)
}

module.exports = invCont
