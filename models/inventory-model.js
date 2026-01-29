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

/* ***************************
 *  Get a classification by name (case-insensitive)
 * ************************** */
async function getClassificationByName(classification_name) {
  try {
    const data = await pool.query(
      'SELECT classification_id, classification_name FROM classification WHERE LOWER(classification_name) = LOWER($1)',
      [classification_name]
    )
    return data.rows[0]
  } catch (error) {
    console.error('getClassificationByName error: ' + error)
    throw error
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      'INSERT INTO classification (classification_name) VALUES ($1) RETURNING classification_id, classification_name',
      [classification_name]
    )
    return data.rows[0]
  } catch (error) {
    console.error('addClassification error: ' + error)
    throw error
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory({
  inv_make,
  inv_model,
  inv_year,
  classification_id,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
}) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        classification_id,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING inv_id
    `
    const params = [
      inv_make,
      inv_model,
      inv_year,
      classification_id,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    ]
    const data = await pool.query(sql, params)
    return data.rows[0]
  } catch (error) {
    console.error('addInventory error: ' + error)
    throw error
  }
}

module.exports = {
  getVehicleById,
  getInventoryByClassification,
  getClassifications,
  getClassificationByName,
  addClassification,
  addInventory,
}
