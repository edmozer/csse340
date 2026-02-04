const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")

const Util = {}

/* ************************
 * Constructs the inventory grid HTML
 * ************************** */
Util.buildInventoryGrid = function(data) {
  if (!data || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  let grid = '<ul id="inv-display">'
  
  data.forEach(vehicle => {
    const price = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(vehicle.inv_price)

    grid += '<li>'
    grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`
    grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">`
    grid += '</a>'
    grid += '<div class="namePrice">'
    grid += '<hr>'
    grid += `<h2><a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`
    grid += `${vehicle.inv_make} ${vehicle.inv_model}`
    grid += '</a></h2>'
    grid += `<span>${price}</span>`
    grid += '</div>'
    grid += '</li>'
  })
  
  grid += '</ul>'
  return grid
}

/* ************************
 * Constructs the vehicle detail HTML
 * ************************** */
Util.buildVehicleDetailHTML = function(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(vehicle.inv_price)

  const mileage =
    vehicle.inv_miles || vehicle.inv_miles === 0
      ? new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
      : 'N/A'

  let html = '<div class="vehicle-detail">'
  html += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">`
  html += '<div class="vehicle-info">'
  html += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`
  html += `<p class="price"><strong>Price: ${price}</strong></p>`
  html += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`
  html += `<p><strong>Color:</strong> ${vehicle.inv_color || 'N/A'}</p>`
  html += `<p><strong>Miles:</strong> ${mileage}</p>`
  html += '</div>'
  html += '</div>'

  return html
}

/* ************************
 * Middleware to check JWT token validity
 * ************************** */
Util.checkJWTToken = function (req, res, next) {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    res.locals.loggedin = 0
    next()
  }
}

/* ************************
 * Check login - redirect to login if not logged in
 * ************************** */
Util.checkLogin = function (req, res, next) {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ************************
 * Check account type - restrict to Employee or Admin
 * ************************** */
Util.checkAccountType = function (req, res, next) {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type
    if (accountType === "Employee" || accountType === "Admin") {
      next()
    } else {
      req.flash("notice", "You do not have permission to access this resource.")
      return res.redirect("/account/login")
    }
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util
