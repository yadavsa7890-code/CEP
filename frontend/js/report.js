/**
 * CyberSafe India - Report Form Module (report.js)
 * Handles form validation, submission to /api/report-scam,
 * and evidence item toggling.
 */

'use strict';

// ── Evidence Toggle ──────────────────────────────────────────────
function toggleEvidence(el) {
  el.classList.toggle('collected');
  const isCollected = el.classList.contains('collected');
  el.setAttribute('aria-checked', isCollected);

  const total   = document.querySelectorAll('.evidence-item').length;
  const collected = document.querySelectorAll('.evidence-item.collected').length;
  const status  = document.getElementById('evidence-status');
  if (status) {
    status.textContent = `${collected} of ${total} items collected`;
    status.style.color = collected === total ? 'var(--success)' : 'var(--text-secondary)';
  }
}

// Keyboard accessibility for evidence items
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.evidence-item').forEach(item => {
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleEvidence(item);
      }
    });
  });
});

// ── Report Form Submission ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('report-form');
  const submitBtn  = document.getElementById('report-submit-btn');
  const successBox = document.getElementById('report-success');
  const errorBox   = document.getElementById('report-error');
  const successContent = document.getElementById('success-content');
  const errorContent   = document.getElementById('error-content');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    // ── Client-side validation ──────────────────────────────
    const scamType    = document.getElementById('scam-type').value.trim();
    const suspectPhone= document.getElementById('suspect-phone').value.trim();
    const suspectUrl  = document.getElementById('suspect-url').value.trim();
    const details     = document.getElementById('details').value.trim();
    const email       = document.getElementById('report-email').value.trim();

    let valid = true;

    if (!scamType) {
      showFieldError('err-type', 'Please select a scam type.');
      valid = false;
    }
    if (!suspectPhone && !suspectUrl) {
      showFieldError('err-phone', 'Provide at least a suspect phone number or URL/email.');
      valid = false;
    }
    if (!details || details.length < 20) {
      showFieldError('err-details', 'Please provide at least 20 characters describing the incident.');
      valid = false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError('err-email', 'Please enter a valid email address.');
      valid = false;
    }

    if (!valid) return;

    // ── Submit to API ───────────────────────────────────────
    submitBtn.disabled   = true;
    submitBtn.textContent = '⏳ Submitting...';
    successBox.style.display = 'none';
    errorBox.style.display   = 'none';

    try {
      const apiBase = window.API_BASE || '';
      const res = await fetch(`${apiBase}/api/report-scam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scamType, suspectPhone, suspectUrl, details, email })
      });

      const data = await res.json();

      if (data.success) {
        successContent.innerHTML = `
          <div style="margin-bottom:0.75rem;">
            <strong style="font-size:1.1rem; display:block; margin-bottom:0.4rem;">✅ Report Submitted Successfully!</strong>
            Your Ticket ID: <code style="background:rgba(0,0,0,0.2); padding:0.2em 0.5em; border-radius:4px; font-family:monospace; font-size:1rem; color:#6ee7b7;">${escHtml(data.ticketId)}</code>
          </div>
          <p style="margin-bottom:0.75rem;">${escHtml(data.message)}</p>
          <strong style="display:block; margin-bottom:0.4rem;">📋 Next Steps:</strong>
          <ul style="display:flex; flex-direction:column; gap:0.3rem; padding-left:1rem; list-style:disc;">
            ${(data.nextSteps || []).map(s => `<li>${escHtml(s)}</li>`).join('')}
          </ul>
          <div style="margin-top:1.25rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" class="btn btn-primary btn-sm">🌐 File at cybercrime.gov.in</a>
            <a href="tel:1930" class="btn btn-danger btn-sm">📞 Call 1930</a>
          </div>`;
        successBox.style.display = 'block';
        form.reset();
        showToast('Report Submitted', `Ticket ID: ${data.ticketId}`, 'success');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const errors = data.errors ? data.errors.join(' ') : (data.error || 'Submission failed.');
        errorContent.innerHTML = `<strong>❌ Submission Failed:</strong> ${escHtml(errors)}`;
        errorBox.style.display = 'block';
        showToast('Submission Error', errors, 'error');
      }
    } catch (err) {
      errorContent.innerHTML = `<strong>❌ Network Error:</strong> Could not connect to the server. Please try again or call 1930 directly.`;
      errorBox.style.display = 'block';
      showToast('Connection Error', 'Unable to reach server. Call 1930 directly.', 'error');
    } finally {
      submitBtn.disabled    = false;
      submitBtn.innerHTML   = '🚨 Submit Report &amp; Get Ticket ID';
    }
  });

  function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
  }
});
