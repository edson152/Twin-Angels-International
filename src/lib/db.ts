// Database stub - PostgreSQL removed, using in-memory stores instead
// Replace this with a real DB connection when ready for production

export const db = {
  query: async () => { throw new Error('Direct DB queries disabled - use API routes') },
}

export default db
