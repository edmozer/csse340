const Util = {}

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
