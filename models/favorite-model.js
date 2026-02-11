const pool = require('../database')

/* ***************************
 *  Add a vehicle to favorites
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `INSERT INTO favorite (account_id, inv_id)
                 VALUES ($1, $2)
                 ON CONFLICT (account_id, inv_id) DO NOTHING
                 RETURNING *`
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error('addFavorite error: ' + error)
    throw error
  }
}

/* ***************************
 *  Remove a vehicle from favorites
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = 'DELETE FROM favorite WHERE account_id = $1 AND inv_id = $2 RETURNING *'
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error('removeFavorite error: ' + error)
    throw error
  }
}

/* ***************************
 *  Check if a vehicle is favorited by account
 * ************************** */
async function isFavorited(account_id, inv_id) {
  try {
    const sql = 'SELECT 1 FROM favorite WHERE account_id = $1 AND inv_id = $2 LIMIT 1'
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0
  } catch (error) {
    console.error('isFavorited error: ' + error)
    throw error
  }
}

/* ***************************
 *  Get all favorites by account ID
 * ************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `SELECT f.favorite_id, f.favorite_date, i.inv_id, i.inv_year, i.inv_make, i.inv_model, i.inv_price
                 FROM favorite f
                 INNER JOIN inventory i ON f.inv_id = i.inv_id
                 WHERE f.account_id = $1
                 ORDER BY f.favorite_date DESC`
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error('getFavoritesByAccountId error: ' + error)
    throw error
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  isFavorited,
  getFavoritesByAccountId,
}
