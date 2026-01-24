/* ***************************
 * Error handling middleware
 * ************************** */

// 404 handler - catches all unmatched routes
function handle404(req, res, next) {
  const err = new Error('Page not found')
  err.status = 404
  next(err)
}

// Global error handler
function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  
  console.error(`Error ${status}: ${message}`)
  console.error(err.stack)
  
  res.status(status)
  res.render('errors/error', {
    title: `Error ${status}`,
    message: message,
    status: status,
    errors: null
  })
}

module.exports = { handle404, errorHandler }
