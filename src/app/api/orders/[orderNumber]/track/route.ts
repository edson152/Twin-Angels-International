import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const { orderNumber } = params

    const result = await query(
      `SELECT o.*,
        CONCAT(o.customer_first_name, ' ', o.customer_last_name) AS customer_name,
        d.first_name || ' ' || d.last_name AS driver_name,
        d.phone AS driver_phone,
        v.plate AS vehicle_plate
      FROM orders o
      LEFT JOIN drivers d ON o.driver_id = d.id
      LEFT JOIN vehicles v ON o.vehicle_id = v.id
      WHERE o.order_number = $1`,
      [orderNumber.toUpperCase()]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = result.rows[0]
    
    // Fetch order items
    const itemsResult = await query(
      `SELECT product_name AS name, quantity, price FROM order_items WHERE order_id = $1`,
      [order.id]
    )

    return NextResponse.json({
      order_number: order.order_number,
      status: order.status,
      customer_name: order.customer_name,
      total: order.total,
      currency: order.currency,
      created_at: order.created_at,
      estimated_delivery: order.estimated_delivery,
      delivery_zone: order.delivery_zone,
      items: itemsResult.rows,
      driver: order.driver_name
        ? { name: order.driver_name, phone: order.driver_phone }
        : null,
    })
  } catch (error) {
    console.error('Track order error:', error)
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 })
  }
}
