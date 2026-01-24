const pool = require('../database')

/* ***************************
 *  Get vehicle by inventory ID
 * ************************** */
async function getVehicleById(invId) {
  try {
    const data = await pool.query(
      'SELECT * FROM inventory WHERE inv_id = $1',
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    console.error('getVehicleById error: ' + error)
    throw error
  }
}

module.exports = { getVehicleById }
