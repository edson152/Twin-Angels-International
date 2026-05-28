// WhatsApp integration stub
// To enable real WhatsApp notifications, add WHATSAPP_API_URL, WHATSAPP_API_KEY to .env.local

export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  const apiUrl = process.env.WHATSAPP_API_URL
  const apiKey = process.env.WHATSAPP_API_KEY
  if (!apiUrl || !apiKey) {
    console.log(`[WhatsApp stub] To: ${to} | Message: ${message}`)
    return true
  }
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ to, message }),
    })
    return res.ok
  } catch {
    return false
  }
}
