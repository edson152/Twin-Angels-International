// Server-side in-memory order store
// In production, replace with PostgreSQL

export interface OrderItem {
  id: number
  name: string
  quantity: number
  price_usd: number
  price_zig: number
}

export interface Order {
  order_number: string
  status: string
  customer_first_name: string
  customer_last_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  delivery_zone: string
  payment_method: string
  currency: string
  subtotal: number
  delivery_fee: number
  total: number
  notes: string | null
  items: OrderItem[]
  created_at: string
  estimated_delivery: string
  driver?: { name: string; phone: string } | null
}

// Use global to persist across hot reloads in dev
const globalStore = global as unknown as { taOrders: Record<string, Order> }
if (!globalStore.taOrders) globalStore.taOrders = {}

export const ordersStore = globalStore.taOrders

export function generateOrderNumber(): string {
  const num = Math.floor(Math.random() * 90000) + 10000
  return `TA-${num}`
}
