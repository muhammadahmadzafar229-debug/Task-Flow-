# Kaam Karo — Full Stack Todo App

## Ye App Kaise Kaam Karti Hai?

```
[Browser/Frontend] ←→ [API Requests] ←→ [Backend/Server] ←→ [Database]
     index.html              HTTP              server.js         Memory
```

---

## Setup (pehli baar)

### Step 1 — Node.js install karo
👉 https://nodejs.org pe jao, "LTS" version download karo, install karo.

Check karo:
```bash
node --version    # v18 ya upar hona chahiye
npm --version     # 8+ hona chahiye
```

### Step 2 — Backend dependencies install karo
```bash
cd backend
npm install
```

### Step 3 — Server start karo
```bash
npm start
```

Terminal mein ye dikhega:
```
🚀 Kaam Karo Backend chal raha hai!
📡 URL: http://localhost:3000
```

### Step 4 — Frontend open karo
Browser mein jao: `http://localhost:3000/index.html`

---

## API Endpoints (Postman se test karo)

| Method | URL | Kya karta hai |
|--------|-----|---------------|
| GET | /api/tasks | Sare tasks laata hai |
| POST | /api/tasks | Naya task banata hai |
| PATCH | /api/tasks/:id | Task update karta hai |
| DELETE | /api/tasks/:id | Task delete karta hai |
| GET | /api/health | Server check |

### POST example:
```json
{
  "text": "Naya kaam",
  "priority": "high"
}
```

---

## Project Structure

```
todo-app/
├── frontend/
│   └── index.html      ← UI (HTML + CSS + JS)
│
└── backend/
    ├── server.js        ← Express server + API routes
    ├── package.json     ← Dependencies list
    └── README.md        ← Ye file!
```

---

## Agle Steps (seekhte raho!)

1. **MongoDB add karo** — in-memory ki jagah real database
2. **Login system** — har user ke apne tasks
3. **Vercel deploy** — frontend online karo (free)
4. **Render deploy** — backend online karo (free)
