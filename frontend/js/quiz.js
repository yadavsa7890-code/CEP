/**
 * CyberSafe India - Interactive Quiz Module (quiz.js)
 * 5 real-world scam scenarios with instant feedback.
 */

'use strict';

// ── Quiz Questions Data ─────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    category: 'Phishing Email',
    scenario: `FROM: security-alert@sbi-bank-verify.co\nTO: you@example.com\nSUBJECT: ⚠️ URGENT: Your SBI account will be suspended in 24 hours!\n\nDear Customer,\nYour account has suspicious activity. To prevent suspension,\nverify your details immediately:\n→ Click here: http://sbi-verify.xyz/kyc-update\nFailure to verify within 24 hours will result in account closure.\n\n- SBI Customer Security Team`,
    question: 'You receive this email. What should you do?',
    options: [
      { text: 'Click the link immediately to verify my account before it gets suspended', correct: false },
      { text: 'Delete the email — this is a phishing attempt', correct: true },
      { text: 'Reply to the email asking for more time', correct: false },
      { text: 'Forward it to my family to warn them', correct: false },
    ],
    correctIndex: 1,
    explanation: {
      title: '🚨 This is a Phishing Email!',
      why: 'Multiple red flags: (1) Sender domain "sbi-bank-verify.co" is NOT sbi.co.in, (2) Link points to "sbi-verify.xyz" — a fake domain, (3) Generic "Dear Customer" instead of your name, (4) Artificial urgency "24 hours". SBI will never email you to click a link for verification. Always go directly to sbi.co.in by typing it yourself.'
    }
  },
  {
    id: 2,
    category: 'Fake SMS / Smishing',
    scenario: `SMS from: VM-TRAI-IN\n\n"Dear subscriber, your mobile number +91-98765XXXXX is scheduled for deactivation today due to incomplete KYC. To prevent disconnection, update your KYC immediately:\n\nhttps://trai-kyc-update.com/renew\n\nIgnore at your own risk. -TRAI"`,
    question: 'You get this SMS. Is this legitimate?',
    options: [
      { text: 'Yes, TRAI sends KYC renewal SMSes and I should update immediately', correct: false },
      { text: 'No, this is a smishing (SMS phishing) scam — I should ignore and report it', correct: true },
      { text: 'Maybe — I should click the link to check if it looks official', correct: false },
      { text: 'I should call the number in the SMS to verify', correct: false },
    ],
    correctIndex: 1,
    explanation: {
      title: '✅ Correct! This is a Smishing Scam',
      why: 'TRAI does NOT send KYC renewal links via SMS. The domain "trai-kyc-update.com" is not a government domain (official sites use .gov.in). Clicking this link leads to a phishing page that steals your Aadhaar/personal details. Block and report this number to 1909 (Do Not Disturb registry) and cybercrime.gov.in.'
    }
  },
  {
    id: 3,
    category: 'Digital Arrest Scam',
    scenario: `You receive a WhatsApp video call from an unknown number.\nThe caller is in a police uniform and shows an official-looking badge.\n\nCaller: "I am Inspector Rajan from Cyber Crime Branch, CBI Mumbai. A parcel seized at Delhi airport in YOUR name contained 500g of MDMA and 3 fake passports. You are under DIGITAL ARREST. You cannot disconnect this call or contact anyone. To prove your innocence and close this case without FIR, transfer ₹2,50,000 to this UPI ID within 2 hours."`,
    question: 'What is the CORRECT response to this call?',
    options: [
      { text: 'Stay on the call and negotiate a lower amount to avoid legal trouble', correct: false },
      { text: 'Disconnect immediately — this is the Digital Arrest Scam. Call 1930 and inform family.', correct: true },
      { text: 'Transfer a smaller amount first to test if they are real', correct: false },
      { text: 'Ask them to send official documents via WhatsApp before paying', correct: false },
    ],
    correctIndex: 1,
    explanation: {
      title: '🚨 Digital Arrest Scam — India\'s Most Dangerous Scam',
      why: 'There is NO such thing as "digital arrest." No law enforcement agency in India conducts interrogations or arrests via video call. The Supreme Court of India has officially stated this. Real CBI/police officers serve physical notices. The uniform, badge, and background are staged using cheap props. Hanging up is the ONLY correct action. Report to 1930 and cybercrime.gov.in immediately.'
    }
  },
  {
    id: 4,
    category: 'QR Code Fraud',
    scenario: `You listed your old smartphone for ₹8,000 on OLX.\nA buyer contacts you:\n\nBuyer: "I want to buy your phone. I'll pay ₹9,000 — ₹1,000 extra for fast delivery. To send you the payment, I need to send a QR code. Just scan it and you'll instantly RECEIVE the money in your account. Here it is: [QR CODE IMAGE]"\n\nYou scan the QR code in your UPI app. It shows "Pay ₹9,000 to XXXXXX"`,
    question: 'Your UPI app shows "Pay ₹9,000" after scanning the buyer\'s QR. What happened?',
    options: [
      { text: 'This is normal — UPI confirmation screens always say "Pay" when receiving money', correct: false },
      { text: 'This is a QR code scam — the buyer sent a payment REQUEST, not a payment. Do NOT confirm.', correct: true },
      { text: 'Confirm the payment; the ₹9,000 will arrive in my account after I verify', correct: false },
      { text: 'There must be a glitch; ask the buyer to resend the QR code', correct: false },
    ],
    correctIndex: 1,
    explanation: {
      title: '✅ Correct! Classic QR Payment Fraud',
      why: 'Scanning a QR code ALWAYS initiates an OUTGOING payment from your account. You never need to scan a QR code to RECEIVE money — that\'s not how UPI works. The "buyer" sent you a payment request disguised as a payment link. If you had confirmed, ₹9,000 would have left YOUR account. To receive UPI money: share your UPI ID or phone number only. Never scan anything.'
    }
  },
  {
    id: 5,
    category: 'Investment Scam',
    scenario: `You are added to a WhatsApp group: "Elite Stock Market Millionaires 🚀"\n\nA "financial expert" shares daily stock tips. Group members post screenshots of huge profits (₹50,000 in one day!). After 2 weeks, you're invited to a "premium" trading app with guaranteed 35% monthly returns. You invest ₹10,000 and the app shows ₹13,500 profit. When you try to withdraw, a message appears:\n\n"To unlock withdrawal, please pay ₹2,500 tax verification fee first."`,
    question: 'Should you pay the ₹2,500 "tax verification fee" to unlock your profit?',
    options: [
      { text: 'Yes — paying taxes is required by law before withdrawing investment profits', correct: false },
      { text: 'No — this is a classic investment scam. The profits shown are fake; stop sending money.', correct: true },
      { text: 'Maybe — pay half first to see if withdrawal works', correct: false },
      { text: 'Ask for their GST number and company registration to verify legitimacy', correct: false },
    ],
    correctIndex: 1,
    explanation: {
      title: '🚨 Fake Investment Scam — Pig Butchering Fraud',
      why: 'This is the "pig butchering" scam. Legitimate investment platforms NEVER charge fees before releasing profits — tax deductions happen automatically. The WhatsApp group members are all paid actors. The profit screenshot in the app is fake (not a real balance). The ₹2,500 "fee" is a loss — and they will invent new fees until you stop. Your original ₹10,000 is already gone. Report to 1930, cybercrime.gov.in, and SEBI at sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes'
    }
  }
];

// ── State ───────────────────────────────────────────────────────
let currentQ    = 0;
let score       = 0;
let answered    = false;
let userAnswers = [];

// ── DOM References ──────────────────────────────────────────────
const quizArea   = document.getElementById('quiz-area');
const scoreCard  = document.getElementById('score-card');
const qCounter   = document.getElementById('q-counter');
const qScoreLive = document.getElementById('q-score-live');
const qProgress  = document.getElementById('q-progress');
const quizHeader = document.getElementById('quiz-header');

// ── Render Question ─────────────────────────────────────────────
function renderQuestion() {
  if (currentQ >= QUESTIONS.length) {
    showScoreCard();
    return;
  }

  const q = QUESTIONS[currentQ];
  answered = false;

  // Update header
  qCounter.textContent   = `Question ${currentQ + 1} of ${QUESTIONS.length}`;
  qScoreLive.textContent = `Score: ${score}`;
  const pct = (currentQ / QUESTIONS.length) * 100;
  qProgress.style.width  = `${pct}%`;

  const letters = ['A', 'B', 'C', 'D'];

  quizArea.innerHTML = `
    <div class="quiz-card" role="region" aria-label="Question ${currentQ + 1}">
      <div class="scenario-label">📍 Scenario: ${escHtml(q.category)}</div>
      <div class="scenario-box">${escHtml(q.scenario)}</div>
      <h3>${escHtml(q.question)}</h3>
      <div class="quiz-options" role="group" aria-label="Answer options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" onclick="selectAnswer(${i})" aria-label="Option ${letters[i]}: ${escHtml(opt.text)}">
            <span class="opt-letter">${letters[i]}</span>
            ${escHtml(opt.text)}
          </button>`).join('')}
      </div>
      <div class="quiz-feedback" id="q-feedback" role="alert"></div>
      <div class="quiz-nav">
        <button class="btn btn-primary" id="next-btn" style="display:none;" onclick="nextQuestion()">
          ${currentQ + 1 < QUESTIONS.length ? 'Next Question →' : 'See Results 🏆'}
        </button>
      </div>
    </div>`;
}

// ── Select Answer ───────────────────────────────────────────────
function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const q = QUESTIONS[currentQ];
  const isCorrect = selectedIndex === q.correctIndex;
  if (isCorrect) score++;
  userAnswers.push({ questionId: q.id, selectedIndex, correct: isCorrect });

  const options = quizArea.querySelectorAll('.quiz-option');
  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add('correct');
    if (i === selectedIndex && !isCorrect) btn.classList.add('wrong');
  });

  // Show feedback
  const fb = document.getElementById('q-feedback');
  fb.className = `quiz-feedback show ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
  fb.innerHTML = `
    <strong>${escHtml(q.explanation.title)}</strong>
    ${escHtml(q.explanation.why)}`;

  // Update live score
  qScoreLive.textContent = `Score: ${score}`;

  // Show next button
  document.getElementById('next-btn').style.display = 'inline-flex';

  // Scroll to feedback
  setTimeout(() => fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

// ── Next Question ───────────────────────────────────────────────
function nextQuestion() {
  currentQ++;
  const pct = (currentQ / QUESTIONS.length) * 100;
  qProgress.style.width = `${pct}%`;
  renderQuestion();
  window.scrollTo({ top: document.getElementById('quiz-area').getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
}

// ── Show Score Card ─────────────────────────────────────────────
async function showScoreCard() {
  quizArea.style.display  = 'none';
  quizHeader.style.display = 'none';
  scoreCard.classList.add('show');

  const total   = QUESTIONS.length;
  const pct     = Math.round((score / total) * 100);

  // Determine tier
  let badge, levelText, levelColor, feedbackText;
  if (pct === 100) {
    badge = '🛡️'; levelText = 'Cyber Guardian'; levelColor = 'rgba(16,185,129,0.2)';
    feedbackText = 'Perfect score! You have excellent cyber awareness. Share this quiz with your family to keep them safe too.';
  } else if (pct >= 80) {
    badge = '🔒'; levelText = 'Security Savvy'; levelColor = 'rgba(6,182,212,0.2)';
    feedbackText = 'Great job! Strong awareness with minor gaps. Review the questions you missed and share your knowledge.';
  } else if (pct >= 60) {
    badge = '⚠️'; levelText = 'Stay Alert'; levelColor = 'rgba(245,158,11,0.2)';
    feedbackText = 'Moderate awareness. There are important gaps — scammers could still target you successfully in some scenarios. Read our prevention guide carefully.';
  } else {
    badge = '🚨'; levelText = 'High Risk'; levelColor = 'rgba(239,68,68,0.2)';
    feedbackText = 'You may be vulnerable to online scams. Please review all our resources before going online. Consider sharing with your family too.';
  }

  document.getElementById('sc-badge').textContent    = badge;
  document.getElementById('sc-number').textContent   = score;
  document.getElementById('sc-fraction').textContent = `out of ${total} — ${pct}%`;
  document.getElementById('sc-feedback').textContent = feedbackText;
  const lvl = document.getElementById('sc-level');
  lvl.textContent   = levelText;
  lvl.style.cssText = `background:${levelColor}; color:var(--text-primary); font-size:0.9rem; font-weight:700;`;

  scoreCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Submit to backend
  try {
    const apiBase = window.API_BASE || '';
    const res = await fetch(`${apiBase}/api/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, totalQuestions: total, userAnswers })
    });
    const data = await res.json();
    if (data.success && data.recommendations) {
      const recsSection = document.getElementById('sc-recs');
      const recsList    = document.getElementById('sc-recs-list');
      recsList.innerHTML = data.recommendations.map(r => `<li>${escHtml(r)}</li>`).join('');
      recsSection.style.display = 'block';
    }
  } catch {
    // Recommendations section remains hidden; that's OK
  }

  showToast('Quiz Complete!', `You scored ${score}/${total}. Check your personalized recommendations below.`, pct >= 60 ? 'success' : 'warning');
}

// ── Restart Quiz ────────────────────────────────────────────────
function restartQuiz() {
  currentQ    = 0;
  score       = 0;
  answered    = false;
  userAnswers = [];

  scoreCard.classList.remove('show');
  quizArea.style.display   = '';
  quizHeader.style.display = '';
  qProgress.style.width    = '0%';
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Initialize ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderQuestion();
});
