function sanitizeReturnPath(value) {
  const path = String(value ?? '').trim()
  return /^\/(?!\/)/.test(path) ? path : ''
}

/* ***************************
 *  Validate favorite action data
 * ************************** */
function validateFavoriteAction(req, res, next) {
  const inv_id = parseInt(req.body.inv_id, 10)
  const return_to = sanitizeReturnPath(req.body.return_to)

  req.body.inv_id = inv_id
  req.body.return_to = return_to

  if (!Number.isInteger(inv_id) || inv_id < 1) {
    req.flash('notice', 'Invalid vehicle selection.')
    return res.redirect('/account/')
  }

  next()
}

module.exports = {
  validateFavoriteAction,
}
