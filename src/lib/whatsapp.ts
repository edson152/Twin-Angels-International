interface WhatsAppMessage {
  to: string
  message: string
}

export async function sendWhatsApp({ to, message }: WhatsAppMessage): Promise<boolean> {
  try {
    const apiUrl = process.env.WHATSAPP_API_URL
    const apiKey = process.env.WHATSAPP_API_KEY
    const from = process.env.WHATSAPP_FROM_NUMBER

    if (!apiUrl || !apiKey) {
      console.warn('WhatsApp API not configured, skipping notification')
      return false
    }

    const response = await fetch(`${apiUrl}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from, to, text: message }),
    })

    return response.ok
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return false
  }
}

export const WHATSAPP_TEMPLATES = {
  orderConfirmed: (orderNumber: string, total: string) =>
    `✅ *Twin Angels International*\n\nYour order *#${orderNumber}* has been confirmed!\nTotal: *${total}*\n\nWe'll notify you when your order is being prepared.\n\nThank you for shopping with us! 🛍️`,

  paymentConfirmed: (orderNumber: string) =>
    `💳 *Twin Angels International*\n\nPayment confirmed for order *#${orderNumber}*!\n\nYour order is now being processed. Sit tight! ⚡`,

  orderDispatched: (orderNumber: string, driverName: string, driverPhone: string) =>
    `🚚 *Twin Angels International*\n\nOrder *#${orderNumber}* is on the way!\n\nDriver: *${driverName}*\nContact: ${driverPhone}\n\nExpected delivery today. Please be available to receive your order.`,

  outForDelivery: (orderNumber: string) =>
    `📍 *Twin Angels International*\n\nOrder *#${orderNumber}* is out for delivery right now!\n\nPlease be ready to receive your items. 🎁`,

  delivered: (orderNumber: string) =>
    `🎉 *Twin Angels International*\n\nOrder *#${orderNumber}* has been delivered!\n\nThank you for choosing Twin Angels. We hope you love your purchase!\n\nFor support: wa.me/263XXXXXXXXX`,

  urgent: (message: string) =>
    `🔴 *Twin Angels International - URGENT*\n\n${message}`,
}
