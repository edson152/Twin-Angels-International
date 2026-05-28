#!/usr/bin/env node
/**
 * Database migration runner
 * Usage: node scripts/migrate.js
 */
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function migrate() {
  console.log('🚀 Running Twin Angels database migration...\n')
  const client = await pool.connect()
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'migrate.sql'), 'utf8')
    await client.query(sql)
    console.log('✅ Migration completed successfully!')
    console.log('\n⚠️  IMPORTANT: Change the default admin password immediately!')
    console.log('   Email: admin@twinangels.co.zw')
    console.log('   Default password: Admin@2024\n')
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()
