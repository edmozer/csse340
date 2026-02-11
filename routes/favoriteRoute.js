const express = require('express')
const router = new express.Router()
const favoriteController = require('../controllers/favoriteController')
const utilities = require('../utilities')
const validate = require('../middleware/favorite-validation')

// Add favorite (requires login)
router.post(
  '/add',
  utilities.checkLogin,
  validate.validateFavoriteAction,
  utilities.handleErrors(favoriteController.addFavorite)
)

// Remove favorite (requires login)
router.post(
  '/remove',
  utilities.checkLogin,
  validate.validateFavoriteAction,
  utilities.handleErrors(favoriteController.removeFavorite)
)

module.exports = router
