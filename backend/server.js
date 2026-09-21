/**
 * CyberSafe India - Cyber Scam & Phishing Awareness Website
 * Backend API Server (Node.js + Express)
 *
 * HOW TO RUN:
 *   From backend folder:
 *     npm install
 *     node server.js
 *
 *   From project root folder:
 *     npm start
 */

'use strict';

const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const fs         = require('fs');
const path       = require('path');
const { v4: uuidv4 } = require('uuid');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());                                // Allow cross-origin requests
app.use(bodyParser.json());                     // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Resolve frontend directory path
const frontendPath = path.join(__dirname, '..', 'frontend');
const publicPath   = path.join(__dirname, 'public');
const staticDir    = fs.existsSync(frontendPath) ? frontendPath : (fs.existsSync(publicPath) ? publicPath : null);

if (staticDir) {
  app.use(express.static(staticDir)); // Serve static files
}

// ─── Data Store Paths ─────────────────────────────────────────────────────────
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const REPORTS_FILE  = path.join(dataDir, 'reports.json');
const CONTACTS_FILE = path.join(dataDir, 'contacts.json');
const QUIZ_FILE     = path.join(dataDir, 'quiz-stats.json');

/** Helper: read JSON file safely, return default if missing */
function readJson(filePath, defaultVal = []) {
  try {
    if (!fs.existsSync(filePath)) return defaultVal;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return defaultVal;
  }
}

/** Helper: write data to JSON file */
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/** Helper: sanitize string input (strip HTML tags, trim whitespace) */
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim().substring(0, 2000);
}

/** Helper: basic email validation */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Helper: basic phone validation (10-15 digits, optional +) */
function isValidPhone(phone) {
  return /^\+?[\d\s\-]{7,15}$/.test(phone);
}

// ─── Static Alerts Data ───────────────────────────────────────────────────────
const ALERTS_DATA = [
  {
    id: 1,
    title: "Digital Arrest Scam",
    severity: "CRITICAL",
    date: "2026-09-08",
    description: "Fraudsters impersonate CBI/ED/Police officers via video call, falsely accusing victims of crimes and demanding money to 'resolve' cases.",
    category: "Vishing"
  },
  {
    id: 2,
    title: "APK / Malicious App Fraud",
    severity: "HIGH",
    date: "2026-09-07",
    description: "Scammers send APK files via WhatsApp claiming to be bank KYC apps. Installing grants them remote access to your device.",
    category: "Malicious Apps"
  },
  {
    id: 3,
    title: "FedEx / Courier Parcel Scam",
    severity: "HIGH",
    date: "2026-09-06",
    description: "Victims receive calls claiming a parcel in their name contains drugs/illegal items and are coerced into transferring money to avoid 'arrest'.",
    category: "Vishing"
  },
  {
    id: 4,
    title: "Fake Investment / Trading App Scam",
    severity: "CRITICAL",
    date: "2026-09-05",
    description: "Fraudulent apps promise guaranteed returns on stock/crypto investments. Initial small withdrawals are allowed to build trust before large sums are stolen.",
    category: "Financial Fraud"
  },
  {
    id: 5,
    title: "OTP Phishing via SMS",
    severity: "HIGH",
    date: "2026-09-04",
    description: "Fake bank SMS messages trick users into sharing OTPs under the guise of KYC updates or account verification.",
    category: "Phishing"
  },
  {
    id: 6,
    title: "QR Code Payment Fraud",
    severity: "MEDIUM",
    date: "2026-09-03",
    description: "Scammers send QR codes claiming victims will RECEIVE money. Scanning initiates a payment FROM the victim's account instead.",
    category: "QR Fraud"
  },
  {
    id: 7,
    title: "Fake Loan App Extortion",
    severity: "HIGH",
    date: "2026-09-02",
    description: "Predatory loan apps harvest contacts and photos, then harass borrowers with morphed images sent to family members.",
    category: "Financial Fraud"
  },
  {
    id: 8,
    title: "Part-Time Job / Task Scam",
    severity: "MEDIUM",
    date: "2026-09-01",
    description: "Victims are asked to rate products or complete tasks for pay. Initial small payouts build trust before victims are asked to invest money that is never returned.",
    category: "Work-From-Home Fraud"
  }
];

// ─── API Routes ────────────────────────────────────────────────────────────────

/**
 * GET /api/alerts
 * Returns the latest high-alert scam warnings for the homepage ticker.
 */
app.get('/api/alerts', (req, res) => {
  try {
    res.json({
      success: true,
      count: ALERTS_DATA.length,
      alerts: ALERTS_DATA
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch alerts.' });
  }
});

/**
 * POST /api/report-scam
 * Accepts scam report details, validates, stores to reports.json,
 * and returns a unique ticket ID for tracking.
 *
 * Body: { suspectPhone, suspectUrl, scamType, details, email? }
 */
app.post('/api/report-scam', (req, res) => {
  try {
    const { suspectPhone, suspectUrl, scamType, details, email } = req.body;

    // --- Input Validation ---
    const errors = [];
    if (!sanitize(scamType))  errors.push('Scam type is required.');
    if (!sanitize(details) || sanitize(details).length < 20)
      errors.push('Details must be at least 20 characters.');
    if (!sanitize(suspectPhone) && !sanitize(suspectUrl))
      errors.push('Provide at least a suspect phone number or URL.');
    if (suspectPhone && !isValidPhone(suspectPhone))
      errors.push('Invalid phone number format.');
    if (email && !isValidEmail(email))
      errors.push('Invalid email address.');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // --- Build Report Record ---
    const ticketId = 'CSI-' + uuidv4().split('-')[0].toUpperCase();
    const report = {
      ticketId,
      timestamp: new Date().toISOString(),
      scamType:     sanitize(scamType),
      suspectPhone: sanitize(suspectPhone || ''),
      suspectUrl:   sanitize(suspectUrl   || ''),
      details:      sanitize(details),
      email:        email ? sanitize(email) : '',
      status: 'received'
    };

    // --- Persist to reports.json ---
    const reports = readJson(REPORTS_FILE, []);
    reports.push(report);
    writeJson(REPORTS_FILE, reports);

    console.log(`[REPORT] New scam report logged: ${ticketId} | Type: ${report.scamType}`);

    res.status(201).json({
      success: true,
      message: 'Your report has been submitted successfully. Forward it to cybercrime.gov.in for official action.',
      ticketId,
      nextSteps: [
        'Call 1930 (National Cyber Crime Helpline) immediately.',
        'File an official complaint at https://cybercrime.gov.in',
        'Keep your Ticket ID for tracking: ' + ticketId
      ]
    });
  } catch (err) {
    console.error('[ERROR] /api/report-scam:', err);
    res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
});

/**
 * POST /api/submit-quiz
 * Accepts quiz results and returns personalized security feedback.
 *
 * Body: { score, totalQuestions, userAnswers }
 */
app.post('/api/submit-quiz', (req, res) => {
  try {
    const { score, totalQuestions, userAnswers } = req.body;

    // --- Validation ---
    if (typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return res.status(400).json({ success: false, error: 'Invalid quiz data.' });
    }
    if (score < 0 || score > totalQuestions) {
      return res.status(400).json({ success: false, error: 'Score out of valid range.' });
    }

    const percentage = Math.round((score / totalQuestions) * 100);

    // --- Personalized Feedback Tiers ---
    let level, badge, feedback, recommendations;
    if (percentage === 100) {
      level = 'Expert';
      badge = '🛡️ Cyber Guardian';
      feedback = 'Outstanding! You have excellent cyber awareness. You can identify phishing attempts with confidence.';
      recommendations = [
        'Share this quiz with friends and family.',
        'Consider completing an advanced cybersecurity course.',
        'Help others by reporting scams at cybercrime.gov.in'
      ];
    } else if (percentage >= 80) {
      level = 'Advanced';
      badge = '🔒 Security Savvy';
      feedback = 'Great job! You have strong cyber awareness with minor gaps. Review the areas you missed.';
      recommendations = [
        'Review the Scam Types page for areas you missed.',
        'Enable 2FA on all your critical accounts.',
        'Set up a password manager if you have not already.'
      ];
    } else if (percentage >= 60) {
      level = 'Intermediate';
      badge = '⚠️ Stay Alert';
      feedback = 'You have a basic understanding, but there are important gaps. Scammers could still trick you in some scenarios.';
      recommendations = [
        'Read our Prevention Guide carefully.',
        'Never click links in unexpected SMS/emails.',
        'Verify any caller claiming to be from a government agency by calling the official number.'
      ];
    } else {
      level = 'Beginner';
      badge = '🚨 High Risk';
      feedback = 'Your score suggests you may be vulnerable to online scams. Please review all our resources before going online.';
      recommendations = [
        'Start with our Scam Types page to understand threats.',
        'Never share OTPs, PINs, or passwords with anyone.',
        'Call 1930 immediately if you suspect you have been scammed.',
        'Ask a trusted person to help you set up security features.'
      ];
    }

    // --- Log quiz stats ---
    const stats = readJson(QUIZ_FILE, { totalAttempts: 0, scoreDistribution: {} });
    stats.totalAttempts = (stats.totalAttempts || 0) + 1;
    const key = String(score);
    stats.scoreDistribution[key] = (stats.scoreDistribution[key] || 0) + 1;
    writeJson(QUIZ_FILE, stats);

    res.json({
      success: true,
      score,
      totalQuestions,
      percentage,
      level,
      badge,
      feedback,
      recommendations
    });
  } catch (err) {
    console.error('[ERROR] /api/submit-quiz:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

/**
 * POST /api/contact
 * Accepts general inquiries or new scam pattern reports.
 *
 * Body: { name, email, subject, message }
 */
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // --- Validation ---
    const errors = [];
    if (!sanitize(name) || sanitize(name).length < 2)
      errors.push('Name must be at least 2 characters.');
    if (!email || !isValidEmail(email))
      errors.push('A valid email address is required.');
    if (!sanitize(subject) || sanitize(subject).length < 5)
      errors.push('Subject must be at least 5 characters.');
    if (!sanitize(message) || sanitize(message).length < 10)
      errors.push('Message must be at least 10 characters.');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const contact = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      name:    sanitize(name),
      email:   sanitize(email),
      subject: sanitize(subject),
      message: sanitize(message)
    };

    const contacts = readJson(CONTACTS_FILE, []);
    contacts.push(contact);
    writeJson(CONTACTS_FILE, contacts);

    console.log(`[CONTACT] New inquiry from: ${contact.name} <${contact.email}>`);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will review your submission and respond within 48 hours.',
      referenceId: contact.id
    });
  } catch (err) {
    console.error('[ERROR] /api/contact:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// ─── Catch-All: Serve index.html or API status ─────────────────────────────────
app.get('*', (req, res) => {
  if (staticDir && fs.existsSync(path.join(staticDir, 'index.html'))) {
    res.sendFile(path.join(staticDir, 'index.html'));
  } else {
    res.json({ message: 'CyberSafe India Backend API is active.' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║   CyberSafe India - Awareness Platform       ║');
  console.log('  ║   Server running at http://localhost:' + PORT + '     ║');
  console.log('  ║   Press Ctrl+C to stop                       ║');
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');
});
