const invModel = require("../models/inventory-model")

const Util = {}

/* ************************
 * Escape HTML special characters
 * ************************** */
Util.escapeHtml = function (str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/* ************************
 * Wrap async route handlers
 * ************************** */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/* ************************
 * Build the navigation bar
 * ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let nav = '<ul class="nav-list">'
  nav += '<li><a href="/" title="Home page">Home</a></li>'
  data.forEach((row) => {
    const name = Util.escapeHtml(row.classification_name)
    nav += `<li><a href="/inv/type/${encodeURIComponent(row.classification_name)}" title="View ${name} vehicles">${name}</a></li>`
  })
  nav += "</ul>"
  return nav
}

/* ************************
 * Build classification select list
 * ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.forEach((row) => {
    const name = Util.escapeHtml(row.classification_name)
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id != null && Number(row.classification_id) === Number(classification_id)) {
      classificationList += " selected"
    }
    classificationList += `>${name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}

/* ************************
 * Constructs the inventory grid HTML
 * ************************** */
Util.buildInventoryGrid = function (data) {
  if (!data || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  let grid = '<ul id="inv-display">'

  data.forEach((vehicle) => {
    const price = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  const mileage = vehicle.inv_miles ? new Intl.NumberFormat('en-US').format(vehicle.inv_miles) : 'N/A'

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

module.exports = Util
