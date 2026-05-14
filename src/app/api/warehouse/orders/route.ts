import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        o.id, o.order_number,
        CONCAT(o.customer_first_name, ' ', o.customer_last_name) AS customer,
        o.delivery_zone AS zone,
        o.status, o.is_urgent,
        o.created_at,
        o.warehouse_picker AS picker,
        STRING_AGG(oi.product_name || ' ×' || oi.quantity, ', ') AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.status IN ('payment_confirmed', 'processing', 'warehouse_picking', 'ready_for_dispatch')
      GROUP BY o.id, o.order_number, o.customer_first_name, o.customer_last_name,
               o.delivery_zone, o.status, o.is_urgent, o.created_at, o.warehouse_picker
      ORDER BY o.is_urgent DESC, o.created_at ASC
    `)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Warehouse orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch warehouse orders' }, { status: 500 })
  }
}
