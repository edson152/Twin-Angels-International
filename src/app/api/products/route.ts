import { NextRequest, NextResponse } from 'next/server'

const STATIC_PRODUCTS = [
  { id: 1, name: 'Portland Cement 50kg Bag', slug: 'portland-cement-50kg', category: 'Building Materials', category_slug: 'building-materials', description: 'High-strength Portland cement for all construction works. Meets ZABS standards.', price_usd: 12, price_zig: 840, compare_price_usd: 15, stock: 500, is_active: true, is_featured: true, is_on_sale: true, images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'] },
  { id: 2, name: 'Executive Leather Office Chair', slug: 'executive-leather-office-chair', category: 'Office Furniture', category_slug: 'office-furniture', description: 'Premium executive leather chair with lumbar support and height adjustment.', price_usd: 185, price_zig: 12950, compare_price_usd: 220, stock: 15, is_active: true, is_featured: true, is_on_sale: true, images: ['https://images.unsplash.com/photo-1541558869434-2840d308329a?w=600&q=80'] },
  { id: 3, name: 'Cotton Poplin Fabric Roll 60m', slug: 'cotton-poplin-60m', category: 'Fabric Rolls', category_slug: 'fabric-rolls', description: 'Premium 100% cotton poplin. 60m roll, 150cm wide.', price_usd: 85, price_zig: 5950, compare_price_usd: 100, stock: 40, is_active: true, is_featured: false, is_on_sale: false, images: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80'] },
  { id: 4, name: 'Digital Flatbed Printer A3', slug: 'digital-flatbed-printer-a3', category: 'Printing Machines', category_slug: 'printing-machines', description: 'Professional A3 UV flatbed printer. Prints on wood, glass, acrylic, metal.', price_usd: 1200, price_zig: 84000, compare_price_usd: 1450, stock: 5, is_active: true, is_featured: true, is_on_sale: true, images: ['https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80'] },
  { id: 5, name: '3-Seater Fabric Sofa', slug: '3-seater-fabric-sofa', category: 'House Furniture', category_slug: 'house-furniture', description: 'Comfortable 3-seater sofa with high-density foam and solid hardwood frame.', price_usd: 420, price_zig: 29400, compare_price_usd: 500, stock: 10, is_active: true, is_featured: false, is_on_sale: true, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'] },
  { id: 6, name: 'Steel Rebar 12mm × 6m', slug: 'steel-rebar-12mm', category: 'Building Materials', category_slug: 'building-materials', description: 'High tensile deformed steel rebar, 12mm × 6m, Grade 60.', price_usd: 45, price_zig: 3150, compare_price_usd: 52, stock: 300, is_active: true, is_featured: false, is_on_sale: false, images: ['https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=600&q=80'] },
  { id: 7, name: 'Ceramic Floor Tiles 60×60cm', slug: 'ceramic-floor-tiles-60x60', category: 'Building Materials', category_slug: 'building-materials', description: 'Premium glazed ceramic floor tiles, anti-slip surface. Price per m².', price_usd: 18, price_zig: 1260, compare_price_usd: 22, stock: 800, is_active: true, is_featured: false, is_on_sale: true, images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80'] },
  { id: 8, name: 'Height-Adjustable Standing Desk', slug: 'height-adjustable-standing-desk', category: 'Office Furniture', category_slug: 'office-furniture', description: 'Electric height-adjustable desk, 160×80cm top. Range 70–120cm.', price_usd: 320, price_zig: 22400, compare_price_usd: 380, stock: 8, is_active: true, is_featured: false, is_on_sale: false, images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80'] },
  { id: 9, name: 'Polyester Satin Fabric 50m', slug: 'polyester-satin-50m', category: 'Fabric Rolls', category_slug: 'fabric-rolls', description: 'Smooth lustrous satin fabric. 50m roll, 150cm wide.', price_usd: 65, price_zig: 4550, compare_price_usd: 75, stock: 25, is_active: true, is_featured: false, is_on_sale: false, images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80'] },
  { id: 10, name: 'Large Format UV Flatbed Printer', slug: 'large-format-uv-printer', category: 'Printing Machines', category_slug: 'printing-machines', description: 'Industrial large format UV printer, 2.5m × 1.3m print area. Up to 30 m²/hr.', price_usd: 3500, price_zig: 245000, compare_price_usd: 4200, stock: 2, is_active: true, is_featured: true, is_on_sale: false, images: ['https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80'] },
  { id: 11, name: 'Queen Size Bed Frame', slug: 'queen-bed-frame', category: 'House Furniture', category_slug: 'house-furniture', description: 'Solid eucalyptus wood queen bed with upholstered headboard. Fits 160×200cm mattress.', price_usd: 280, price_zig: 19600, compare_price_usd: 330, stock: 12, is_active: true, is_featured: false, is_on_sale: true, images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80'] },
  { id: 12, name: 'TV & Entertainment Stand', slug: 'tv-entertainment-stand', category: 'House Furniture', category_slug: 'house-furniture', description: 'Modern TV stand for up to 75" TVs. Two cabinets with adjustable shelves.', price_usd: 150, price_zig: 10500, compare_price_usd: 185, stock: 20, is_active: true, is_featured: false, is_on_sale: true, images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80'] },
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
    if (sort === 'price_asc') products = [...products].sort((a, b) => a.price_usd - b.price_usd)
    else if (sort === 'price_desc') products = [...products].sort((a, b) => b.price_usd - a.price_usd)

    const total = products.length
    const paged = products.slice((page - 1) * limit, page * limit)
    return NextResponse.json({ products: paged, total, page, limit, pages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
