const reviewModel = require('../models/review-model')
const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

const reviewCont = {}

/* ***************************
 *  Add a new review
 * ************************** */
reviewCont.addReview = async function (req, res, next) {
  try {
    const { review_text, inv_id } = req.body
    const account_id = res.locals.accountData.account_id
    
    const result = await reviewModel.addReview(review_text, inv_id, account_id)
    
    if (result) {
      req.flash('notice', 'Review added successfully!')
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash('notice', 'Sorry, adding review failed.')
      res.redirect(`/inv/detail/${inv_id}`)
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build edit review view
 * ************************** */
reviewCont.buildEditReview = async function (req, res, next) {
  try {
    const review_id = parseInt(req.params.review_id)
    const review = await reviewModel.getReviewById(review_id)
    
    if (!review) {
      req.flash('notice', 'Review not found.')
      return res.redirect('/account/')
    }
    
    // Check if user owns this review
    if (review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You can only edit your own reviews.')
      return res.redirect('/account/')
    }
    
    const vehicleName = `${review.inv_year} ${review.inv_make} ${review.inv_model}`
    
    res.render('review/edit', {
      title: `Edit Review - ${vehicleName}`,
      errors: null,
      review_id: review.review_id,
      review_text: review.review_text,
      vehicleName,
      review_date: new Date(review.review_date).toLocaleDateString()
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process edit review
 * ************************** */
reviewCont.updateReview = async function (req, res, next) {
  try {
    const { review_id, review_text } = req.body
    
    // Verify ownership
    const review = await reviewModel.getReviewById(review_id)
    if (!review || review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You can only edit your own reviews.')
      return res.redirect('/account/')
    }
    
    const result = await reviewModel.updateReview(review_id, review_text)
    
    if (result) {
      req.flash('notice', 'Review updated successfully!')
      res.redirect('/account/')
    } else {
      req.flash('notice', 'Sorry, update failed.')
      res.redirect(`/review/edit/${review_id}`)
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build delete review confirmation view
 * ************************** */
reviewCont.buildDeleteReview = async function (req, res, next) {
  try {
    const review_id = parseInt(req.params.review_id)
    const review = await reviewModel.getReviewById(review_id)
    
    if (!review) {
      req.flash('notice', 'Review not found.')
      return res.redirect('/account/')
    }
    
    // Check if user owns this review
    if (review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You can only delete your own reviews.')
      return res.redirect('/account/')
    }
    
    const vehicleName = `${review.inv_year} ${review.inv_make} ${review.inv_model}`
    
    res.render('review/delete', {
      title: `Delete Review - ${vehicleName}`,
      errors: null,
      review_id: review.review_id,
      review_text: review.review_text,
      vehicleName,
      review_date: new Date(review.review_date).toLocaleDateString()
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process delete review
 * ************************** */
reviewCont.deleteReview = async function (req, res, next) {
  try {
    const { review_id } = req.body
    
    // Verify ownership
    const review = await reviewModel.getReviewById(review_id)
    if (!review || review.account_id !== res.locals.accountData.account_id) {
      req.flash('notice', 'You can only delete your own reviews.')
      return res.redirect('/account/')
    }
    
    const result = await reviewModel.deleteReview(review_id)
    
    if (result) {
      req.flash('notice', 'Review deleted successfully!')
    } else {
      req.flash('notice', 'Sorry, delete failed.')
    }
    res.redirect('/account/')
  } catch (error) {
    next(error)
  }
}

module.exports = reviewCont
