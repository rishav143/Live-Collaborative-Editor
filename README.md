# 📹 Demo Video
Add your demo video link here.

---

## Live Collaborative Editor
A simple app where people write together in real time and get help from AI to improve their text.

---

## What it does
- Write together in the same document
- Ask AI to improve, shorten, or lengthen text
- Turn text into a table
- Chat with AI and use web search

---

## How it works (plain English)
- Client (website you open): Next.js + React
- Server (handles requests): Next.js API routes
- AI: Google Gemini (optional). Without a key, simple demo answers are used
- Real‑time: yjs + y‑webrtc keep everyone in sync

---

## Folders
- `client/` — the website
- `server/` — the API

---

## Requirements
- Node.js 18+
- Terminal (macOS Terminal, Windows PowerShell, etc.)
- Optional: Google Gemini API key (for better AI answers)

---

## Run locally
1) Install packages
```bash
cd client && npm install && cd ../server && npm install && cd ..
```
2) Set environment variables
- Create `client/.env.local`:
```
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```
- Create `server/.env.local` (optional but recommended):
```
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGIN=*
```
3) Start the server (Terminal A)
```bash
cd server
npm run dev
# http://localhost:3001
```
4) Start the client (Terminal B)
```bash
cd client
npm run dev
# http://localhost:3000
```
5) Open http://localhost:3000 in your browser

---

## Using the app
- Type in the editor; invite a friend to type too
- Select text → use the floating toolbar (Improve/Shorten/Lengthen/Table)
- Use the right sidebar to chat with AI or click “Web search”

Tip: No AI key? It still works with simple demo replies.

---

## Deploy
- Client on Vercel
  - Set `NEXT_PUBLIC_SERVER_URL` to your server URL
    - Example: `https://live-collaborative-editor-hrt4.onrender.com`
- Server on Render
  - Set `ALLOWED_ORIGIN` to your client URL (or `*` while testing)
  - Optional: `GEMINI_API_KEY` for real AI answers

---

## Troubleshooting
- Failed to fetch
  - Usually `NEXT_PUBLIC_SERVER_URL` is missing on the client
  - Fix on Vercel: set it to your server URL
- CORS errors
  - Set `ALLOWED_ORIGIN` on the server to your client domain
- AI replies are too basic
  - Add `GEMINI_API_KEY` on the server

---

## Common commands
Client
```bash
cd client
npm run dev
npm run build
npm start
```
Server
```bash
cd server
npm run dev
```

---

## Credits
Built with Next.js, React, yjs, and Google Gemini.
