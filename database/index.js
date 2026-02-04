const { Pool } = require('pg')
require('dotenv').config()

// Enable SSL for Render database (external connections require SSL)
const isRenderDB = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: (process.env.NODE_ENV === 'production' || isRenderDB) ? { rejectUnauthorized: false } : false
})

module.exports = pool
