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

/* ***************************
 *  Get all inventory items by classification name
 * ************************** */
async function getInventoryByClassification(classificationName) {
  try {
    const data = await pool.query(
      `SELECT i.*, c.classification_name
       FROM inventory i
       INNER JOIN classification c ON i.classification_id = c.classification_id
       WHERE c.classification_name = $1`,
      [classificationName]
    )
    return data.rows
  } catch (error) {
    console.error('getInventoryByClassification error: ' + error)
    throw error
  }
}

/* ***************************
 *  Get all classifications
 * ************************** */
async function getClassifications() {
  try {
    const data = await pool.query(
      'SELECT * FROM classification ORDER BY classification_name'
    )
    return data.rows
  } catch (error) {
    console.error('getClassifications error: ' + error)
    throw error
  }
}

module.exports = {
  getVehicleById,
  getInventoryByClassification,
  getClassifications,
}
