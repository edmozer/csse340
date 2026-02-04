function sanitizeString(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .replace(/<[^>]*>/g, "")
    .trim()
}

/* ***************************
 *  Validate review data
 * ************************** */
function validateReview(req, res, next) {
  const errors = []

  const review_text = sanitizeString(req.body.review_text)
  const inv_id = parseInt(req.body.inv_id, 10)

  // Review text validation
  if (!review_text) {
    errors.push({ msg: "Review text is required." })
  } else if (review_text.length < 10) {
    errors.push({ msg: "Review must be at least 10 characters long." })
  } else if (review_text.length > 1000) {
    errors.push({ msg: "Review cannot exceed 1000 characters." })
  }

  // Inventory ID validation
  if (!Number.isInteger(inv_id) || inv_id < 1) {
    errors.push({ msg: "Invalid vehicle." })
  }

  req.body.review_text = review_text
  req.body.inv_id = inv_id

  if (errors.length > 0) {
    req.flash("notice", errors[0].msg)
    return res.redirect(`/inv/detail/${inv_id}`)
  }
  next()
}

/* ***************************
 *  Validate review update data
 * ************************** */
function validateReviewUpdate(req, res, next) {
  const errors = []

  const review_text = sanitizeString(req.body.review_text)
  const review_id = parseInt(req.body.review_id, 10)

  // Review text validation
  if (!review_text) {
    errors.push({ msg: "Review text is required." })
  } else if (review_text.length < 10) {
    errors.push({ msg: "Review must be at least 10 characters long." })
  } else if (review_text.length > 1000) {
    errors.push({ msg: "Review cannot exceed 1000 characters." })
  }

  // Review ID validation
  if (!Number.isInteger(review_id) || review_id < 1) {
    errors.push({ msg: "Invalid review." })
  }

  req.body.review_text = review_text
  req.body.review_id = review_id

  if (errors.length > 0) {
    req.flash("notice", errors[0].msg)
    return res.redirect(`/review/edit/${review_id}`)
  }
  next()
}

module.exports = {
  validateReview,
  validateReviewUpdate
}
