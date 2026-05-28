import { NextRequest, NextResponse } from 'next/server'
import { ordersStore } from '@/lib/ordersStore'

export async function GET(_req: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const order = ordersStore[params.orderNumber.toUpperCase()]
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { orderNumber: string } }) {
  try {
    const order = ordersStore[params.orderNumber.toUpperCase()]
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    const updates = await req.json()
    ordersStore[params.orderNumber.toUpperCase()] = { ...order, ...updates }
    return NextResponse.json(ordersStore[params.orderNumber.toUpperCase()])
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
