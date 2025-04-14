export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const TELEGRAM_CHAT_ID = '-1002591774479'
  const TELEGRAM_BOT_TOKEN = '7867931896:AAGXjAAG5NbuLIK3AaCvIwnh15KiTaY0j_I'

  const { actif, action, timestamp } = req.body
  const message = `🧠 *Signal IA généré :*\n\n*Actif* : ${actif}\n*Action* : ${action}\n*Horodatage* : ${timestamp}`

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    const data = await response.json()

    if (!data.ok) {
      console.error('Erreur Telegram:', data)
      return res.status(500).json({ error: 'Erreur Telegram', details: data })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Erreur réseau Telegram:', error)
    res.status(500).json({ error: 'Erreur réseau Telegram' })
  }
}
