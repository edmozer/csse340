require('dotenv').config()
const bcrypt = require('bcryptjs')
const pool = require('../database')

async function upsertRequiredAccounts() {
  const required = [
    {
      account_firstname: 'Basic',
      account_lastname: 'User',
      account_email: 'basic@340.edu',
      account_type: 'Customer',
      password: process.env.BASIC_ACCOUNT_PASSWORD,
    },
    {
      account_firstname: 'Happy',
      account_lastname: 'Employee',
      account_email: 'happy@340.edu',
      account_type: 'Employee',
      password: process.env.HAPPY_ACCOUNT_PASSWORD,
    },
    {
      account_firstname: 'Manager',
      account_lastname: 'Admin',
      account_email: 'manager@340.edu',
      account_type: 'Admin',
      password: process.env.MANAGER_ACCOUNT_PASSWORD,
    },
  ]

  const missing = required
    .filter((account) => !account.password)
    .map((account) => account.account_email)

  if (missing.length > 0) {
    throw new Error(
      `Missing required password env vars for: ${missing.join(', ')}. ` +
        'Set BASIC_ACCOUNT_PASSWORD, HAPPY_ACCOUNT_PASSWORD, and MANAGER_ACCOUNT_PASSWORD.'
    )
  }

  for (const account of required) {
    const hashedPassword = await bcrypt.hash(account.password, 10)
    const sql = `
      INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (account_email)
      DO UPDATE SET
        account_firstname = EXCLUDED.account_firstname,
        account_lastname = EXCLUDED.account_lastname,
        account_password = EXCLUDED.account_password,
        account_type = EXCLUDED.account_type
      RETURNING account_id, account_email, account_type
    `

    const values = [
      account.account_firstname,
      account.account_lastname,
      account.account_email,
      hashedPassword,
      account.account_type,
    ]

    const result = await pool.query(sql, values)
    const row = result.rows[0]
    console.log(`Upserted ${row.account_email} (${row.account_type})`) // eslint-disable-line no-console
  }
}

upsertRequiredAccounts()
  .then(async () => {
    await pool.end()
    console.log('Required accounts seeded successfully.') // eslint-disable-line no-console
  })
  .catch(async (error) => {
    await pool.end()
    console.error('Failed to seed required accounts:', error.message) // eslint-disable-line no-console
    process.exit(1)
  })
