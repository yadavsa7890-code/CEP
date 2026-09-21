# 🖥️ CyberSafe India — Backend

This folder contains the complete Node.js + Express backend API for CyberSafe India.

---

## 📁 Files & Structure

```
backend/
├── data/
│   ├── reports.json        ← Stored scam reports with ticket IDs
│   ├── contacts.json       ← Stored contact / inquiry submissions
│   └── quiz-stats.json     ← Quiz attempt counters and score distribution
├── package.json            ← Backend dependencies and npm scripts
├── server.js               ← Main Express server and API endpoints
└── README.md               ← This file
```

---

## 🚀 How to Run Backend

### Option A: From inside the `backend` folder
```bash
cd backend
npm install
npm start
```

For auto-reloading during development:
```bash
npm run dev
```

### Option B: From the root project folder
```bash
npm start
```

The server will start at: **`http://localhost:3000`**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/alerts` | Live security warnings ticker data |
| `POST` | `/api/report-scam` | Submit cyber scam report & get tracking ticket |
| `POST` | `/api/submit-quiz` | Record quiz score & receive tailored advice |
| `POST` | `/api/contact` | Submit general helpline inquiries |
