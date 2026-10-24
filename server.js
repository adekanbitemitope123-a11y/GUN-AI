import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);
const model = process.env.OPENAI_MODEL || "gpt-6-astra";

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(openai), model });
});

app.post("/api/chat", async (req, res) => {
  if (!openai) {
    return res.status(503).json({
      error: "OpenAI is not configured. Add OPENAI_API_KEY to your .env file and restart the server."
    });
  }

  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return res.status(400).json({ error: "Send between 1 and 20 recent messages." });
  }

  const allowedRoles = new Set(["user", "assistant"]);
  const cleanMessages = [];
  for (const item of messages) {
    if (!item || !allowedRoles.has(item.role) || typeof item.content !== "string") {
      return res.status(400).json({ error: "Each message needs a valid role and text content." });
    }
    const content = item.content.trim();
    if (!content || content.length > 8000) {
      return res.status(400).json({ error: "Each message must be 1–8,000 characters." });
    }
    cleanMessages.push({ role: item.role, content });
  }

  try {
    const response = await openai.responses.create({
      model,
      instructions: "You are GUN AI, a helpful, clear, and thoughtful AI assistant. Be accurate, explain uncertainty, and format answers for readability.",
      input: cleanMessages
    });

    res.json({ reply: response.output_text || "I couldn't produce a text response. Please try again." });
  } catch (error) {
    console.error("OpenAI request failed:", error?.status || error?.name || "unknown error");
    const status = error?.status === 429 ? 429 : 502;
    res.status(status).json({
      error: status === 429
        ? "The API rate limit or usage limit was reached. Check your OpenAI API account and try again."
        : "GUN AI couldn't reach the AI service. Check your API key and model configuration, then try again."
    });
  }
});

app.listen(port, () => {
  console.log(`GUN AI running at http://localhost:${port}`);
});
