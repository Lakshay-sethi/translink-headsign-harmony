const ALLOWED_USERS = [123456789, 987654321];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "Missing TELEGRAM_BOT_TOKEN" });
  }

  const body =
    typeof req.body === "string"
      ? (() => {
          try {
            return JSON.parse(req.body);
          } catch {
            return null;
          }
        })()
      : req.body;

  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid webhook payload" });
  }

  const message = body.message;
  const fromId = message?.from?.id;

  if (typeof fromId !== "number") {
    return res.status(400).json({ error: "Missing sender id" });
  }

  if (!ALLOWED_USERS.includes(fromId)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const chatId = message?.chat?.id;
  const text = message?.text;

  if (typeof chatId !== "number") {
    return res.status(400).json({ error: "Missing chat id" });
  }

  if (typeof text !== "string") {
    return res.status(200).json({ ok: true, ignored: true });
  }

  const replyText =
    text.trim() === "/start"
      ? "👋 Bot is working! You are authorized."
      : text;

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
      }),
    },
  );

  if (!telegramResponse.ok) {
    const errorText = await telegramResponse.text();
    return res.status(502).json({
      error: "Failed to send Telegram message",
      details: errorText,
    });
  }

  return res.status(200).json({ ok: true });
}
