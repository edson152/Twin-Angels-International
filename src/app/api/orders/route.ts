import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { sendWhatsApp, WHATSAPP_TEMPLATES } from '@/lib/whatsapp'

function generateOrderNumber(): string {
  const num = Math.floor(Math.random() * 90000) + 10000
  return `TA-${num}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customer, items, currency, delivery_zone, payment_method, subtotal, delivery_fee, total } = body

    if (!customer?.firstName || !customer?.email || !customer?.phone || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const order_number = generateOrderNumber()

    // Insert order (in production, use a transaction)
    const orderResult = await query(
      `INSERT INTO orders (
        order_number, customer_first_name, customer_last_name,
        customer_email, customer_phone, customer_address,
        delivery_zone, payment_method, currency,
        subtotal, delivery_fee, total, status, notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending',$13)
      RETURNING id, order_number`,
      [
        order_number,
        customer.firstName,
        customer.lastName,
        customer.email,
        customer.phone,
        customer.address,
        delivery_zone,
        payment_method,
        currency,
        subtotal,
        delivery_fee,
        total,
        customer.notes || null,
      ]
    )

    const orderId = orderResult.rows[0].id

    // Insert order items
    for (const item of items) {
      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, currency)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.id, item.name, item.quantity, currency === 'USD' ? item.price_usd : item.price_zig, currency]
      )
    }

    // Send WhatsApp notification
    const totalStr = `${currency === 'USD' ? '$' : 'ZiG'} ${total.toLocaleString()}`
    await sendWhatsApp({
      to: customer.phone,
      message: WHATSAPP_TEMPLATES.orderConfirmed(order_number, totalStr),
    })

    return NextResponse.json({ order_number, message: 'Order placed successfully' }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    // Admin endpoint - list all orders
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20
    const offset = (page - 1) * limit

    let queryText = `
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
    `
    const params: unknown[] = []

    if (status) {
      queryText += ` WHERE o.status = $1`
      params.push(status)
    }

    queryText += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await query(queryText, params)
    return NextResponse.json({ orders: result.rows, page, limit })
  } catch (error) {
    console.error('List orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
