/**
 * CyberSafe India - Contact Form Module (contact.js)
 * Handles the scam pattern submission form on contact.html.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('contact-form');
  const submitBtn   = document.getElementById('contact-submit-btn');
  const successBox  = document.getElementById('contact-success');
  const errorBox    = document.getElementById('contact-error');
  const errorContent= document.getElementById('contact-error-content');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    let valid = true;

    if (!name || name.length < 2) {
      showFieldError('cerr-name', 'Please enter your name (minimum 2 characters).'); valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError('cerr-email', 'Please enter a valid email address.'); valid = false;
    }
    if (!subject || subject.length < 5) {
      showFieldError('cerr-subject', 'Subject must be at least 5 characters.'); valid = false;
    }
    if (!message || message.length < 10) {
      showFieldError('cerr-message', 'Message must be at least 10 characters.'); valid = false;
    }

    if (!valid) return;

    submitBtn.disabled   = true;
    submitBtn.textContent = '⏳ Sending...';
    successBox.style.display = 'none';
    errorBox.style.display   = 'none';

    try {
      const apiBase = window.API_BASE || '';
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();

      if (data.success) {
        successBox.style.display = 'block';
        form.reset();
        showToast('Message Sent', 'We received your report and will review it. Thank you!', 'success');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const errors = data.errors ? data.errors.join(', ') : (data.error || 'Submission failed.');
        errorContent.innerHTML = `<strong>❌ Error:</strong> ${escHtml(errors)}`;
        errorBox.style.display = 'block';
        showToast('Submission Error', errors, 'error');
      }
    } catch {
      errorContent.innerHTML = `<strong>❌ Network Error:</strong> Unable to connect to the server. Please try again later.`;
      errorBox.style.display = 'block';
      showToast('Connection Error', 'Please try again or contact 1930 directly.', 'error');
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = '📨 Send Message';
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
