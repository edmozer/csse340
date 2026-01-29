const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

const invCont = {}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  res.render('inventory/management', {
    title: 'Inventory Management',
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  res.render('inventory/add-classification', {
    title: 'Add Classification',
    errors: null,
    classification_name: '',
  })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const errors = req.validationErrors || []
    const { classification_name } = req.body

    if (errors.length) {
      return res.render('inventory/add-classification', {
        title: 'Add Classification',
        errors,
        classification_name,
      })
    }

    const existing = await invModel.getClassificationByName(classification_name)
    if (existing) {
      return res.render('inventory/add-classification', {
        title: 'Add Classification',
        errors: [
          { msg: `Classification "${classification_name}" already exists.` },
        ],
        classification_name,
      })
    }

    const result = await invModel.addClassification(classification_name)
    if (result) {
      req.flash('notice', `Classification "${classification_name}" added successfully.`)
      return res.redirect('/inv')
    }

    return res.render('inventory/add-classification', {
      title: 'Add Classification',
      errors: null,
      classification_name,
      notice: ['Sorry, the classification could not be added.'],
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    const classificationList = await utilities.buildClassificationList()
    res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      errors: null,
      classificationList,
      inv_make: '',
      inv_model: '',
      inv_year: '',
      classification_id: '',
      inv_description: '',
      inv_image: '/images/vehicles/no-image.png',
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
      inv_price: '',
      inv_miles: '',
      inv_color: '',
    })
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const errors = req.validationErrors || []
    const {
      inv_make,
      inv_model,
      inv_year,
      classification_id,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    } = req.body

    if (errors.length) {
      const classificationList = await utilities.buildClassificationList(classification_id)
      return res.render('inventory/add-inventory', {
        title: 'Add Inventory',
        errors,
        classificationList,
        inv_make,
        inv_model,
        inv_year,
        classification_id,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      })
    }

    const result = await invModel.addInventory(req.body)
    if (result) {
      req.flash('notice', 'New inventory item added successfully.')
      return res.redirect('/inv')
    }

    const classificationList = await utilities.buildClassificationList(classification_id)
    return res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      errors: null,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      classification_id,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      notice: ['Sorry, the inventory item could not be added.'],
    })
  } catch (err) {
    next(err)
  }
}

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
