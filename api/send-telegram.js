export default async function handler(req, res) {
  console.log("↪️ Reçu une requête sur /api/send-telegram");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const TELEGRAM_BOT_TOKEN = '7867931896:AAGXjAAG5NbuLIK3AaCvIwnh15KiTaY0j_I';
  const TELEGRAM_CHAT_ID = '-1002591774479'; // ID du groupe MoonPulse Dev

  const { actif, action, timestamp } = req.body;

  const message = `📡 *Signal IA généré* \n\n*Actif* : ${actif}\n*Action* : ${action}\n*Horodatage* : ${timestamp}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const telegramRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const data = await telegramRes.json();
    console.log("✅ Message envoyé à Telegram :", data);

    if (!data.ok) {
      throw new Error(data.description || 'Échec de l’envoi Telegram');
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Erreur Telegram:", err);
    return res.status(500).json({ error: err.message || 'Erreur serveur' });
  }
}
