import { NextRequest, NextResponse } from 'next/server'
import { CATEGORIES } from '@/lib/constants'

// Static product data - in production replace with DB
// This mirrors the adminStore default products
const STATIC_PRODUCTS = [
  { id: 1, name: 'Portland Cement 50kg', slug: 'portland-cement-50kg', category: 'Building Materials', category_slug: 'building-materials', description: 'High-quality Portland cement for construction.', price_usd: 12, price_zig: 840, compare_price_usd: 15, stock: 500, is_active: true, is_featured: true, is_on_sale: true, images: [] },
  { id: 2, name: 'Executive Leather Chair', slug: 'executive-leather-office-chair', category: 'Office Furniture', category_slug: 'office-furniture', description: 'Premium executive leather office chair.', price_usd: 185, price_zig: 12950, compare_price_usd: 220, stock: 15, is_active: true, is_featured: true, is_on_sale: true, images: [] },
  { id: 3, name: 'Cotton Poplin Fabric 60m', slug: 'cotton-poplin-60m', category: 'Fabric Rolls', category_slug: 'fabric-rolls', description: 'Premium cotton poplin fabric roll.', price_usd: 85, price_zig: 5950, compare_price_usd: 100, stock: 40, is_active: true, is_featured: false, is_on_sale: false, images: [] },
  { id: 4, name: 'Digital Flatbed Printer A3', slug: 'digital-flatbed-printer-a3', category: 'Printing Machines', category_slug: 'printing-machines', description: 'Professional A3 digital flatbed printer.', price_usd: 1200, price_zig: 84000, compare_price_usd: 1450, stock: 5, is_active: true, is_featured: true, is_on_sale: true, images: [] },
  { id: 5, name: '3-Seater Fabric Sofa', slug: '3-seater-fabric-sofa', category: 'House Furniture', category_slug: 'house-furniture', description: 'Comfortable 3-seater fabric sofa.', price_usd: 420, price_zig: 29400, compare_price_usd: 500, stock: 10, is_active: true, is_featured: false, is_on_sale: true, images: [] },
  { id: 6, name: 'Steel Rebar 12mm x 6m', slug: 'steel-rebar-12mm', category: 'Building Materials', category_slug: 'building-materials', description: 'High tensile steel rebar for reinforced concrete.', price_usd: 45, price_zig: 3150, compare_price_usd: 52, stock: 300, is_active: true, is_featured: false, is_on_sale: false, images: [] },
  { id: 7, name: 'Ceramic Floor Tiles 60x60', slug: 'ceramic-floor-tiles-60x60', category: 'Building Materials', category_slug: 'building-materials', description: 'Premium ceramic floor tiles per square metre.', price_usd: 18, price_zig: 1260, compare_price_usd: 22, stock: 800, is_active: true, is_featured: false, is_on_sale: true, images: [] },
  { id: 8, name: 'Office Standing Desk', slug: 'office-standing-desk', category: 'Office Furniture', category_slug: 'office-furniture', description: 'Height-adjustable standing desk.', price_usd: 320, price_zig: 22400, compare_price_usd: 380, stock: 8, is_active: true, is_featured: false, is_on_sale: false, images: [] },
  { id: 9, name: 'Polyester Satin Fabric 50m', slug: 'polyester-satin-50m', category: 'Fabric Rolls', category_slug: 'fabric-rolls', description: 'Smooth polyester satin fabric roll.', price_usd: 65, price_zig: 4550, compare_price_usd: 75, stock: 25, is_active: true, is_featured: false, is_on_sale: false, images: [] },
  { id: 10, name: 'Large Format UV Printer', slug: 'large-format-uv-printer', category: 'Printing Machines', category_slug: 'printing-machines', description: 'Large format UV flatbed printer for signage.', price_usd: 3500, price_zig: 245000, compare_price_usd: 4200, stock: 2, is_active: true, is_featured: true, is_on_sale: false, images: [] },
  { id: 11, name: 'Queen Bed Frame', slug: 'queen-bed-frame', category: 'House Furniture', category_slug: 'house-furniture', description: 'Solid wood queen size bed frame.', price_usd: 280, price_zig: 19600, compare_price_usd: 330, stock: 12, is_active: true, is_featured: false, is_on_sale: true, images: [] },
  { id: 12, name: 'TV & Entertainment Stand', slug: 'tv-entertainment-stand', category: 'House Furniture', category_slug: 'house-furniture', description: 'Modern TV stand with storage for up to 65-inch TVs.', price_usd: 150, price_zig: 10500, compare_price_usd: 185, stock: 20, is_active: true, is_featured: false, is_on_sale: true, images: [] },
]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let products = STATIC_PRODUCTS.filter(p => p.is_active)

    if (category) products = products.filter(p => p.category_slug === category)
    if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    if (featured === 'true') products = products.filter(p => p.is_featured)

    if (sort === 'price_asc') products.sort((a, b) => a.price_usd - b.price_usd)
    else if (sort === 'price_desc') products.sort((a, b) => b.price_usd - a.price_usd)

    const total = products.length
    const paged = products.slice((page - 1) * limit, page * limit)

    return NextResponse.json({ products: paged, total, page, limit, pages: Math.ceil(total / limit) })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
