import { NextRequest, NextResponse } from 'next/server'
import { ordersStore } from '@/lib/ordersStore'

export async function GET(_req: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const order = ordersStore[params.orderNumber.toUpperCase()]
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    return NextResponse.json({
      order_number: order.order_number,
      status: order.status,
      customer_name: `${order.customer_first_name} ${order.customer_last_name}`,
      total: order.total,
      currency: order.currency,
      created_at: order.created_at,
      estimated_delivery: order.estimated_delivery,
      delivery_zone: order.delivery_zone,
      items: order.items.map((i: any) => ({
        name: i.name,
        quantity: i.quantity,
        price: order.currency === 'USD' ? i.price_usd : i.price_zig,
      })),
      driver: order.driver || null,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 })
  }
}
