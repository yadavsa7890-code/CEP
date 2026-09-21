/**
 * CyberSafe India - Shared Utilities (main.js)
 * Loaded on every page for common functionality.
 */

'use strict';

// ── API Base URL Configuration ────────────────────────────────
// Automatically connects to backend at http://localhost:3000 when opened via Live Server or file://
window.API_BASE = window.API_BASE || (
  (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000'))
    ? 'http://localhost:3000'
    : ''
);

/* ── Navigation ─────────────────────────────────────────────── */
(function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close menu on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  // Highlight active nav link
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Scroll to Top Button ───────────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── Toast Notification System ──────────────────────────────── */
window.showToast = function(title, message, type = 'info', duration = 5000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '🚨', warning: '⚠️', info: '🔔' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <div class="toast-body">
      <strong>${escHtml(title)}</strong>
      <p>${escHtml(message)}</p>
    </div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, duration);
};

/* ── Helper: escape HTML ────────────────────────────────────── */
window.escHtml = function(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
};

/* ── Alert Ticker Loader ─────────────────────────────────────── */
async function loadAlertTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track) return;

  try {
    const res  = await fetch(`${window.API_BASE}/api/alerts`);
    const data = await res.json();
    if (!data.success || !data.alerts.length) return;

    const items = data.alerts.map(a =>
      `<span class="ticker-item"><strong>[${a.severity}]</strong> ${escHtml(a.title)}: ${escHtml(a.description)}<span class="ticker-sep">  ◆  </span></span>`
    ).join('');
    // Duplicate for seamless loop
    track.innerHTML = items + items;
  } catch {
    // Fail silently — static fallback already in HTML
  }
}
document.addEventListener('DOMContentLoaded', loadAlertTicker);

/* ── Accordion ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all in the same parent
      item.closest('.accordion')?.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });
});

/* ── Tabs ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-nav').forEach(nav => {
    const container = nav.closest('.tabs');
    nav.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        nav.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        container.querySelector(`#${target}`)?.classList.add('active');
      });
    });
  });
});

/* ── Checklist progress tracker ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.check-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      updateChecklistProgress(item.closest('.checklist-section'));
    });
  });

  function updateChecklistProgress(section) {
    if (!section) return;
    const items   = section.querySelectorAll('.check-item');
    const checked = section.querySelectorAll('.check-item.checked').length;
    const bar     = section.querySelector('.check-progress-bar');
    if (bar) bar.style.width = `${(checked / items.length) * 100}%`;
    const label = section.querySelector('.check-progress-label');
    if (label) label.textContent = `${checked}/${items.length} completed`;
  }
});

/* ── Intersection Observer for scroll animations ────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .helpline-card, .step-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
