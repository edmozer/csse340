const favoriteModel = require('../models/favorite-model')
const invModel = require('../models/inventory-model')

const favoriteCont = {}

/* ***************************
 *  Add vehicle to favorites
 * ************************** */
favoriteCont.addFavorite = async function (req, res, next) {
  try {
    const { inv_id, return_to } = req.body
    const account_id = res.locals.accountData.account_id

    const vehicle = await invModel.getVehicleById(inv_id)
    if (!vehicle) {
      req.flash('notice', 'Vehicle not found.')
      return res.redirect('/account/')
    }

    const result = await favoriteModel.addFavorite(account_id, inv_id)

    if (result) {
      req.flash('notice', 'Vehicle added to favorites.')
    } else {
      req.flash('notice', 'Vehicle is already in your favorites.')
    }

    return res.redirect(return_to || `/inv/detail/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Remove vehicle from favorites
 * ************************** */
favoriteCont.removeFavorite = async function (req, res, next) {
  try {
    const { inv_id, return_to } = req.body
    const account_id = res.locals.accountData.account_id

    const result = await favoriteModel.removeFavorite(account_id, inv_id)

    if (result) {
      req.flash('notice', 'Vehicle removed from favorites.')
    } else {
      req.flash('notice', 'Vehicle was not in your favorites.')
    }

    return res.redirect(return_to || '/account/')
  } catch (error) {
    next(error)
  }
}

module.exports = favoriteCont
