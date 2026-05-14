import { Pool } from 'pg'

const globalForPg = global as unknown as { pgPool: Pool }

const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = pool

export default pool

export async function query(text: string, params?: unknown[]) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  if (process.env.NODE_ENV === 'development') {
    console.log('executed query', { text: text.slice(0, 80), duration, rows: res.rowCount })
  }
  return res
}

export async function getClient() {
  const client = await pool.connect()
  const originalQuery = client.query.bind(client)
  const release = client.release.bind(client)
  let lastQuery: unknown[] = []
  client.query = (...args: unknown[]) => {
    lastQuery = args
    return (originalQuery as (...a: unknown[]) => unknown)(...args)
  }
  client.release = () => {
    client.query = originalQuery
    client.release = release
    return release()
  }
  return client
}
