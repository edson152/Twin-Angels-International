// Server-side in-memory order store with global persistence across hot reloads
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

const globalStore = global as unknown as { taOrders: Record<string, Order> }
if (!globalStore.taOrders) {
  globalStore.taOrders = {}
  // Seed with demo orders so Track Order always works
  const demo: Order = {
    order_number: 'TA-00001',
    status: 'out_for_delivery',
    customer_first_name: 'Demo',
    customer_last_name: 'Customer',
    customer_email: 'demo@example.com',
    customer_phone: '+263 77 000 0001',
    customer_address: '1 Test Street, Harare',
    delivery_zone: 'harare',
    payment_method: 'ecocash',
    currency: 'USD',
    subtotal: 85,
    delivery_fee: 5,
    total: 90,
    notes: null,
    items: [
      { id: 1, name: 'Portland Cement 50kg', quantity: 5, price_usd: 12, price_zig: 840 },
      { id: 6, name: 'Steel Rebar 12mm × 6m', quantity: 1, price_usd: 45, price_zig: 3150 },
    ],
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    driver: { name: 'Takudzwa Moyo', phone: '+263 77 111 2222' },
  }
  globalStore.taOrders['TA-00001'] = demo
}

export const ordersStore = globalStore.taOrders

export function generateOrderNumber(): string {
  const num = Math.floor(Math.random() * 90000) + 10000
  return `TA-${num}`
}
