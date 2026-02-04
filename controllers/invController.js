const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

const invCont = {}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      errors: null,
      notice: req.flash ? req.flash('notice') : null
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render('inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      errors: null,
      classification_name: ''
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)
    
    if (result) {
      let nav = await utilities.getNav()
      req.flash('notice', `Classification "${classification_name}" added successfully.`)
      res.status(201).render('inventory/management', {
        title: 'Inventory Management',
        nav,
        errors: null,
        notice: req.flash('notice')
      })
    } else {
      let nav = await utilities.getNav()
      req.flash('notice', 'Sorry, adding classification failed.')
      res.status(501).render('inventory/add-classification', {
        title: 'Add New Classification',
        nav,
        errors: null,
        classification_name,
        notice: req.flash('notice')
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
      nav,
      classificationList,
      errors: null,
      inv_make: '',
      inv_model: '',
      inv_year: '',
      inv_description: '',
      inv_image: '/images/vehicles/no-image.png',
      inv_thumbnail: '/images/vehicles/no-image-tn.png',
      inv_price: '',
      inv_miles: '',
      inv_color: ''
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    } = req.body

    const result = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    )

    if (result) {
      let nav = await utilities.getNav()
      req.flash('notice', `Vehicle "${inv_make} ${inv_model}" added successfully.`)
      res.status(201).render('inventory/management', {
        title: 'Inventory Management',
        nav,
        errors: null,
        notice: req.flash('notice')
      })
    } else {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      req.flash('notice', 'Sorry, adding vehicle failed.')
      res.status(501).render('inventory/add-inventory', {
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
        notice: req.flash('notice')
      })
    }
  } catch (error) {
    next(error)
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
      title: title,
      grid: grid,
      errors: null
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
