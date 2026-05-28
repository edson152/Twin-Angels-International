#!/usr/bin/env node
/**
 * Database seed script — sample products for development
 * Usage: node scripts/seed.js
 */
const { Pool } = require('pg')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

const products = [
  // Building Materials
  { name: 'Portland Cement 50kg Bag', slug: 'portland-cement-50kg', desc: 'High-strength Portland cement, ideal for all construction works.', usd: 12, zig: 840, cmp: 15, cat: 'building-materials', stock: 500 },
  { name: 'Steel Rebar 12mm × 6m', slug: 'steel-rebar-12mm-6m', desc: 'Deformed steel bar for reinforced concrete construction.', usd: 8.5, zig: 595, cat: 'building-materials', stock: 300 },
  { name: 'Ceramic Floor Tiles 60×60cm (Box)', slug: 'ceramic-floor-tiles-60x60', desc: 'Premium ceramic floor tiles, 4 pieces per box.', usd: 28, zig: 1960, cmp: 35, cat: 'building-materials', stock: 200, sale: true },
  { name: 'Roofing Sheets IBR 3.0m', slug: 'roofing-sheets-ibr-3m', desc: 'Galvanised IBR roofing sheets 0.47mm thick.', usd: 18, zig: 1260, cat: 'building-materials', stock: 150 },
  { name: 'River Sand (per Tonne)', slug: 'river-sand-per-tonne', desc: 'Washed river sand suitable for plastering and bricklaying.', usd: 45, zig: 3150, cat: 'building-materials', stock: 999 },

  // Fabric Rolls
  { name: 'Cotton Poplin Fabric 60m Roll', slug: 'cotton-poplin-60m', desc: 'Premium quality cotton poplin fabric, 150cm wide. Ideal for garments.', usd: 85, zig: 5950, cmp: 110, cat: 'fabric-rolls', stock: 40, sale: true },
  { name: 'Polyester Satin Fabric 50m Roll', slug: 'polyester-satin-50m', desc: 'Silky smooth polyester satin, 150cm wide. Multiple colours available.', usd: 65, zig: 4550, cat: 'fabric-rolls', stock: 30 },
  { name: 'Denim Fabric Heavy 40m Roll', slug: 'denim-fabric-heavy-40m', desc: 'Heavy-duty 12oz denim fabric for jeans and workwear.', usd: 120, zig: 8400, cat: 'fabric-rolls', stock: 20 },
  { name: 'Linen Blend Fabric 50m Roll', slug: 'linen-blend-50m', desc: 'Natural linen-cotton blend, breathable and durable. 140cm wide.', usd: 95, zig: 6650, cat: 'fabric-rolls', stock: 25 },

  // Printing Machines
  { name: 'Digital Flatbed Printer A3', slug: 'digital-flatbed-printer-a3', desc: 'Professional A3 flatbed digital printer with UV ink. Prints on various surfaces.', usd: 1200, zig: 84000, cmp: 1450, cat: 'printing-machines', stock: 5, sale: true },
  { name: 'Wide Format Vinyl Printer 1.6m', slug: 'wide-format-vinyl-1-6m', desc: 'Eco-solvent wide format printer for banners, vinyl, and signage.', usd: 3500, zig: 245000, cat: 'printing-machines', stock: 3 },
  { name: 'DTF Transfer Printer A4', slug: 'dtf-transfer-printer-a4', desc: 'Direct to Film printer for t-shirt printing and garment decoration.', usd: 850, zig: 59500, cat: 'printing-machines', stock: 8 },

  // Office Furniture
  { name: 'Executive Leather Office Chair', slug: 'executive-leather-office-chair', desc: 'High-back genuine leather executive chair with lumbar support and armrests.', usd: 185, zig: 12950, cmp: 220, cat: 'office-furniture', stock: 15, sale: true },
  { name: 'L-Shape Office Desk 1.8m', slug: 'l-shape-office-desk-1-8m', desc: 'Spacious L-shaped office desk with cable management. Melamine finish.', usd: 320, zig: 22400, cat: 'office-furniture', stock: 8 },
  { name: 'Office Reception Desk', slug: 'office-reception-desk', desc: 'Modern reception desk with counter and storage. White and grey finish.', usd: 550, zig: 38500, cat: 'office-furniture', stock: 5 },
  { name: 'Steel Filing Cabinet 4-Drawer', slug: 'steel-filing-cabinet-4drawer', desc: 'Lockable 4-drawer steel filing cabinet. A4/Foolscap compatible.', usd: 145, zig: 10150, cat: 'office-furniture', stock: 20 },

  // House Furniture
  { name: '3-Seater Fabric Sofa', slug: '3-seater-fabric-sofa', desc: 'Comfortable 3-seater sofa with durable fabric upholstery. Multiple colours.', usd: 420, zig: 29400, cmp: 500, cat: 'house-furniture', stock: 10, sale: true },
  { name: 'Solid Wood Dining Table 6-Seater', slug: 'dining-table-6-seater', desc: 'Handcrafted solid mahogany dining table with 6 matching chairs.', usd: 750, zig: 52500, cat: 'house-furniture', stock: 6 },
  { name: 'King Size Bed Frame with Storage', slug: 'king-bed-with-storage', desc: 'King size bed frame with hydraulic lift storage. Includes headboard.', usd: 380, zig: 26600, cat: 'house-furniture', stock: 8 },
  { name: 'Wardrobe 3-Door with Mirror', slug: 'wardrobe-3door-mirror', desc: 'Spacious 3-door wardrobe with full-length mirror and interior shelving.', usd: 495, zig: 34650, cat: 'house-furniture', stock: 7 },
]

async function seed() {
  console.log('🌱 Seeding Twin Angels database with sample products...\n')
  const client = await pool.connect()
  try {
    // Get category IDs
    const catResult = await client.query('SELECT id, slug FROM categories')
    const catMap = Object.fromEntries(catResult.rows.map(r => [r.slug, r.id]))

    let seeded = 0
    for (const p of products) {
      const catId = catMap[p.cat]
      if (!catId) {
        console.warn(`  ⚠️  Category not found: ${p.cat} — skipping ${p.name}`)
        continue
      }
      await client.query(
        `INSERT INTO products
          (name, slug, description, price_usd, price_zig, compare_price_usd,
           category_id, stock, is_on_sale, is_active, images)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,ARRAY['/placeholder-product.jpg'])
         ON CONFLICT (slug) DO NOTHING`,
        [p.name, p.slug, p.desc, p.usd, p.zig, p.cmp || null, catId, p.stock, p.sale || false]
      )
      seeded++
      console.log(`  ✅ ${p.name}`)
    }
    console.log(`\n🎉 Seeded ${seeded} products successfully!`)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

seed()
