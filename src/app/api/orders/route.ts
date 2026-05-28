import { NextRequest, NextResponse } from 'next/server'
import { ordersStore, generateOrderNumber } from '@/lib/ordersStore'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customer, items, currency, delivery_zone, payment_method, subtotal, delivery_fee, total } = body

    if (!customer?.firstName || !customer?.email || !customer?.phone || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const order_number = generateOrderNumber()

    ordersStore[order_number] = {
      order_number,
      status: 'pending',
      customer_first_name: customer.firstName,
      customer_last_name: customer.lastName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_address: customer.address,
      delivery_zone,
      payment_method,
      currency,
      subtotal,
      delivery_fee,
      total,
      notes: customer.notes || null,
      items,
      created_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      driver: null,
    }

    return NextResponse.json({ order_number, message: 'Order placed successfully' }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = Object.values(ordersStore).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return NextResponse.json({ orders, page: 1, limit: 20 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
