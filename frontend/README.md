# 🌐 CyberSafe India — Frontend

This folder contains the complete responsive user interface for CyberSafe India.

---

## 📁 Files & Structure

```
frontend/
├── index.html              ← Home page (Hero, live alert ticker, quick cards)
├── scam-types.html         ← Interactive scam types explorer (vishing, phishing, etc.)
├── prevention.html         ← Prevention guide (checklist, 2FA tips, password hygiene)
├── quiz.html               ← Interactive scam detector quiz
├── report.html             ← Incident reporting portal
├── contact.html            ← Emergency contacts & inquiry form
├── css/
│   └── styles.css          ← Dark cybersecurity design system
├── js/
│   ├── main.js             ← Alert ticker & shared navigation/toast helpers
│   ├── quiz.js             ← 5-question interactive quiz logic
│   ├── report.js           ← Validation & submission to /api/report-scam
│   └── contact.js          ← Validation & submission to /api/contact
└── images/                 ← Visual assets
```

---

## 🚀 How to Run Frontend

### Option 1: Served with the Backend (Recommended)
1. Start the backend: `npm start`
2. Open in your browser: `http://localhost:3000`

### Option 2: Standalone via VS Code Live Server
1. Right-click `frontend/index.html` in VS Code and select **"Open with Live Server"**.
2. If the backend is running at `http://localhost:3000`, the frontend will automatically connect to it via CORS!

### Option 3: Direct File Opening
1. Double-click `frontend/index.html` to open it in any modern browser.
