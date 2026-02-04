const invModel = require("../models/inventory-model")

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

module.exports = Util
