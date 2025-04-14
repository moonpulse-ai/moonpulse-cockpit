export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { actif, action, timestamp } = req.body;

    const TELEGRAM_BOT_TOKEN = '6702398427:AAGu4GSjK-kN8zXiGv0uW6AJyYuhL4LCxOM';
    const TELEGRAM_CHAT_ID = '-1002591774479';

    const message = `🧠 *Signal IA généré* :\n\n*Actif* : ${actif}\n*Action* : ${action}\n*Horodatage* : ${timestamp}`;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.description || 'Erreur inconnue Telegram');
      }

      res.status(200).json({ success: true, message: 'Envoyé à Telegram ✅' });
    } catch (error) {
      console.error('Erreur Telegram API:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }
}
