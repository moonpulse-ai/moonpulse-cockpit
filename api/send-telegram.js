export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { actif, action, timestamp } = req.body
  const message = `📡 *Signal IA généré :*\n\n*Actif* : ${actif}\n*Action* : ${action}\n*Horodatage* : ${timestamp}`

  const TELEGRAM_BOT_TOKEN = '6702398427:AAGu4GSjK-kN8zXiGv0UW6AJyYuhL4LCXoM'
  const TELEGRAM_CHAT_ID = '-1002591774479'
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'Markdown' })
  })

  const data = await response.json()

  if (!data.ok) {
    return res.status(500).json({ error: data.description })
  }

  res.status(200).json({ success: true })
}
