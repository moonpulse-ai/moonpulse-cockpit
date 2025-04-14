export default async function handler(req, res) {
  console.log("✅ Requête reçue par /api/send-telegram");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { actif, action, timestamp } = req.body

  const message = `📡 *Signal IA généré :*\n\n*Actif* : ${actif}\n*Action* : ${action}\n*Horodatage* : ${timestamp}`

  const TELEGRAM_CHAT_ID = '-1002591774479'
  const TELEGRAM_BOT_TOKEN = '6702398427:AAGu4GSjK-kN8zXiGv0uW6AJyYuhL4LCx0M'

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.description || 'Erreur lors de l’envoi du message')
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Erreur Telegram:', error)
    res.status(500).json({ error: 'Erreur interne serveur' })
  }
}
