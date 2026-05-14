import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const featured = searchParams.get('featured')
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  let conditions: string[] = ['p.is_active = true']
  const params: unknown[] = []
  let paramIdx = 1

  if (category) {
    conditions.push(`c.slug = $${paramIdx}`)
    params.push(category)
    paramIdx++
  }

  if (search) {
    conditions.push(`(p.name ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx})`)
    params.push(`%${search}%`)
    paramIdx++
  }

  if (featured === 'true') {
    conditions.push(`p.is_featured = true`)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const sortMap: Record<string, string> = {
    newest: 'p.created_at DESC',
    price_asc: 'p.price_usd ASC',
    price_desc: 'p.price_usd DESC',
    popular: 'p.sales_count DESC',
  }

  const orderBy = sortMap[sort] || sortMap.newest

  const productQuery = `
    SELECT 
      p.id, p.name, p.slug, p.description,
      p.price_usd, p.price_zig, p.compare_price_usd,
      p.stock, p.is_featured, p.is_on_sale,
      p.images[1] AS image,
      c.name AS category, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `

  const countQuery = `
    SELECT COUNT(*) FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
  `

  try {
    const [productsResult, countResult] = await Promise.all([
      query(productQuery, [...params, limit, offset]),
      query(countQuery, params),
    ])

    return NextResponse.json({
      products: productsResult.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      pages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  // Admin only - create product
  try {
    const body = await req.json()
    const {
      name, slug, description, price_usd, price_zig,
      compare_price_usd, category_id, stock, images,
      is_featured, is_on_sale,
    } = body

    const result = await query(
      `INSERT INTO products (
        name, slug, description, price_usd, price_zig,
        compare_price_usd, category_id, stock, images,
        is_featured, is_on_sale, is_active
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true)
      RETURNING *`,
      [name, slug, description, price_usd, price_zig,
       compare_price_usd, category_id, stock, images,
       is_featured ?? false, is_on_sale ?? false]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
