# GUN AI Chat — OpenAI starter

This is a small Node.js starter for connecting the GUN AI chat interface to the OpenAI Responses API.

## Requirements
- Node.js 20+ recommended
- An OpenAI API key with API access and available billing/usage

## Run locally (Windows PowerShell or macOS/Linux)
1. Extract this folder.
2. Open a terminal in the project folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
   - Windows PowerShell: `Copy-Item .env.example .env`
   - macOS/Linux: `cp .env.example .env`
5. Edit `.env` and replace `OPENAI_API_KEY=replace_with_your_key` with your actual API key.
6. Run `npm start`.
7. Open http://localhost:3000.

## Security notes
- Keep `.env` private. It is ignored by Git through `.gitignore`.
- Never paste the API key into `public/index.html`, client-side JavaScript, or a public repository.
- Add authentication, per-user rate limits, abuse monitoring, and spending limits before opening the app to the public.
- This starter keeps recent messages in the browser only; it does not persist conversations to a database.
- The selected model is configured in `.env` as `OPENAI_MODEL`. If your account cannot access the default model, change it to a model available to your API project.

## How it works
The browser sends recent chat messages to `POST /api/chat`. The Express server calls OpenAI's Responses API using the server-side `OPENAI_API_KEY` and returns the generated text.

Docs: https://developers.openai.com/api/docs/quickstart
