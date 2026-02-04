const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')
const validate = require('../middleware/account-validation')

// Deliver login view
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Deliver registration view
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// Process registration
router.post(
  '/register',
  validate.validateRegistration,
  utilities.handleErrors(accountController.registerAccount)
)

// Process login
router.post(
  '/login',
  validate.validateLogin,
  utilities.handleErrors(accountController.accountLogin)
)

// Account management view (requires login)
router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)

// Deliver account update view
router.get(
  '/update/:account_id',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdate)
)

// Process account update
router.post(
  '/update',
  utilities.checkLogin,
  validate.validateAccountUpdate,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  '/update-password',
  utilities.checkLogin,
  validate.validatePasswordChange,
  utilities.handleErrors(accountController.updatePassword)
)

// Process logout
router.get('/logout', utilities.handleErrors(accountController.logout))

module.exports = router
