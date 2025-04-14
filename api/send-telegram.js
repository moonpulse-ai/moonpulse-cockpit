export default async function handler(req, res) {
  console.log("📡 Requête reçue dans /api/send-telegram");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const TELEGRAM_CHAT_ID = '-1002591774479'; // Groupe MoonPulse Dev
  const TELEGRAM_BOT_TOKEN = '8125665096:AAGbFcdIbipcYXZLyYoLEus0oVZjtMbbvtY';

  const signal = req.body;

  const message = `📡 *Signal IA généré :*\n\n*Actif* : ${signal.actif}\n*Action* : ${signal.action}\n*Horodatage* : ${signal.timestamp}`;

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

    if (!telegramRes.ok) {
      const err = await telegramRes.text();
      console.error('❌ Erreur Telegram:', err);
      return res.status(500).json({ error: 'Erreur Telegram', details: err });
    }

    const data = await telegramRes.json();
    console.log('✅ Message envoyé avec succès à Telegram:', data);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Erreur Telegram:', err);
    return res.status(500).json({ error: 'Erreur Telegram', details: err });
  }
}
