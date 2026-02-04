const express = require('express')
const router = new express.Router()
const reviewController = require('../controllers/reviewController')
const utilities = require('../utilities')
const validate = require('../middleware/review-validation')

// Add review (POST from vehicle detail page) - requires login
router.post(
  '/add',
  utilities.checkLogin,
  validate.validateReview,
  utilities.handleErrors(reviewController.addReview)
)

// Edit review routes - requires login
router.get(
  '/edit/:review_id',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReview)
)

router.post(
  '/update',
  utilities.checkLogin,
  validate.validateReviewUpdate,
  utilities.handleErrors(reviewController.updateReview)
)

// Delete review routes - requires login
router.get(
  '/delete/:review_id',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildDeleteReview)
)

router.post(
  '/delete',
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router
