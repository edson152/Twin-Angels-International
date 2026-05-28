export const DELIVERY_ZONES = [
  { id: 'harare', name: 'Harare', fee_usd: 5, fee_zig: 350 },
  { id: 'bulawayo', name: 'Bulawayo', fee_usd: 15, fee_zig: 1050 },
  { id: 'mutare', name: 'Mutare', fee_usd: 18, fee_zig: 1260 },
  { id: 'gweru', name: 'Gweru', fee_usd: 12, fee_zig: 840 },
  { id: 'masvingo', name: 'Masvingo', fee_usd: 20, fee_zig: 1400 },
  { id: 'rural', name: 'Custom Rural Zone', fee_usd: 25, fee_zig: 1750 },
] as const

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  ZIG: { code: 'ZIG', symbol: 'ZiG', name: 'Zimbabwe Gold' },
} as const

export const PAYMENT_METHODS: { id: string; name: string; icon: string; currencies: ('USD' | 'ZIG')[] }[] = [
  { id: 'ecocash',        name: 'EcoCash',          icon: '📱', currencies: ['USD', 'ZIG'] },
  { id: 'onemoney',       name: 'OneMoney',          icon: '💳', currencies: ['USD', 'ZIG'] },
  { id: 'innbucks',       name: 'InnBucks',          icon: '🏦', currencies: ['USD', 'ZIG'] },
  { id: 'bank_transfer',  name: 'Bank Transfer',     icon: '🏛',  currencies: ['USD', 'ZIG'] },
  { id: 'visa_mastercard',name: 'Visa / Mastercard', icon: '💳', currencies: ['USD'] },
] as const

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  PROCESSING: 'processing',
  WAREHOUSE_PICKING: 'warehouse_picking',
  READY_FOR_DISPATCH: 'ready_for_dispatch',
  DISPATCHED: 'dispatched',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  payment_pending: 'Awaiting Payment',
  payment_confirmed: 'Payment Confirmed',
  processing: 'Processing',
  warehouse_picking: 'Being Picked',
  ready_for_dispatch: 'Ready to Ship',
  dispatched: 'Dispatched',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

export const CATEGORIES = [
  { id: 'building-materials', name: 'Building Materials', icon: '🧱', slug: 'building-materials' },
  { id: 'fabric-rolls', name: 'Fabric Rolls', icon: '🧵', slug: 'fabric-rolls' },
  { id: 'printing-machines', name: 'Printing Machines', icon: '🖨️', slug: 'printing-machines' },
  { id: 'office-furniture', name: 'Office Furniture', icon: '🪑', slug: 'office-furniture' },
  { id: 'house-furniture', name: 'House Furniture', icon: '🛋️', slug: 'house-furniture' },
] as const

export const WHATSAPP_SUPPORT = '+263XXXXXXXXX'
export const SUPPORT_EMAIL = 'edsonnyoni92@gmail.com'
export const COMPANY_NAME = 'Twin Angels International Development'

export const USD_TO_ZIG_RATE = 70 // Update this via admin panel
