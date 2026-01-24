const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL environment variable.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function initDatabase() {
  try {
    console.log('Connecting to database...')

    const sqlPath = path.join(__dirname, 'database', 'rebuild.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('Executing SQL rebuild script...')
    await pool.query(sql)

    console.log('✓ Database initialized successfully!')
  } catch (error) {
    console.error('✗ Error initializing database:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

initDatabase()
