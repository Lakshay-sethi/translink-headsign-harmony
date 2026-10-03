const ALLOWED_USERS = [123456789, 987654321];

async function sendTelegramMessage(token, chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${errorBody}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "Missing TELEGRAM_BOT_TOKEN" });
  }

  const update = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const message = update?.message;
  const userId = message?.from?.id;
  const chatId = message?.chat?.id;
  const text = message?.text;

  if (!userId || !chatId || typeof text !== "string") {
    return res.status(200).json({ ok: true, ignored: true });
  }

  if (!ALLOWED_USERS.includes(userId)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const replyText =
    text.trim() === "/start"
      ? "👋 Bot is working! You are authorized."
      : text;

  try {
    await sendTelegramMessage(token, chatId, replyText);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return res.status(502).json({ error: "Failed to send message" });
  }
}
