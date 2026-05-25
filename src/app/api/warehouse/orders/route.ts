import { NextResponse } from 'next/server'
import { ordersStore } from '@/lib/ordersStore'

export async function GET() {
  const warehouseOrders = Object.values(ordersStore)
    .filter(o => ['processing', 'payment_confirmed', 'warehouse_picking', 'ready_for_dispatch'].includes(o.status))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

  return NextResponse.json(warehouseOrders)
}
