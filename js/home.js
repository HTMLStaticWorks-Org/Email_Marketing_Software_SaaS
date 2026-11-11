/* ==========================================================================
   MailFlow Homepage Interactive Behaviors
   ========================================================================== */

(function (window, document, $) {
  'use strict';

  const PREVIEW_VIEWS = {
    overview: `
      <div class="mf-preview-kpis">
        <div class="mf-mini-stat">
          <div class="mf-mini-stat-label">Emails Delivered</div>
          <div class="mf-mini-stat-val">142,840</div>
          <span class="mf-badge mf-badge-success mt-1">+18.4% vs last mo</span>
        </div>
        <div class="mf-mini-stat">
          <div class="mf-mini-stat-label">Avg. Open Rate</div>
          <div class="mf-mini-stat-val">49.4%</div>
          <span class="mf-badge mf-badge-primary mt-1">Top 5% SaaS</span>
        </div>
        <div class="mf-mini-stat">
          <div class="mf-mini-stat-label">Attributed Revenue</div>
          <div class="mf-mini-stat-val">$38,920</div>
          <span class="mf-badge mf-badge-info mt-1">12 active flows</span>
        </div>
      </div>
      <div class="p-3 rounded-3" style="background:var(--mf-bg-elevated);border:1px solid var(--mf-border);">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-semibold small">Q4 AI Workflow Release — Live Dispatch</span>
          <span class="mf-badge mf-badge-success">99.5% Inbox</span>
        </div>
        <div class="progress" style="height:8px;background:var(--mf-surface);">
          <div class="progress-bar" style="width:84%;background:linear-gradient(90deg,var(--mf-primary),var(--mf-secondary));"></div>
        </div>
        <div class="d-flex justify-content-between small mt-2" style="color:var(--mf-text-muted);">
          <span>18,420 recipients</span>
          <span>11.8% CTR · 0.12% Unsub</span>
        </div>
      </div>
    `,
    automation: `
      <div class="mf-preview-kpis">
        <div class="mf-mini-stat">
          <div class="mf-mini-stat-label">Welcome Flow</div>
          <div class="mf-mini-stat-val">38.4%</div>
          <span class="mf-badge mf-badge-success mt-1">Active · 4,280 in</span>
        </div>
        <div class="mf-mini-stat">
          <div class="mf-mini-stat-label">Cart Recovery</div>
          <div class="mf-mini-stat-val">24.1%</div>
          <span class="mf-badge mf-badge-primary mt-1">$14.2k recovered</span>
        </div>
        <div class="mf-mini-stat">
          <div class="mf-mini-stat-label">Re-engagement</div>
          <div class="mf-mini-stat-val">16.8%</div>
          <span class="mf-badge mf-badge-warning mt-1">Condition branch</span>
        </div>
      </div>
      <div class="p-3 rounded-3 d-flex flex-wrap gap-2 align-items-center justify-content-between" style="background:var(--mf-bg-elevated);border:1px solid var(--mf-border);">
        <span class="small fw-semibold">Trigger: Signup &rarr; Wait 2d &rarr; Opened? &rarr; Send VIP Offer</span>
        <a href="dashboard.html#automation" class="mf-btn mf-btn-primary mf-btn-sm">Edit Workflow</a>
      </div>
    `,
    deliverability: `
      <div class="mf-preview-kpis">
        <div class="mf-mini-stat">
          <div class="mf-mini-stat-label">Domain Score</div>
          <div class="mf-mini-stat-val">99 / 100</div>
          <span class="mf-badge mf-badge-success mt-1">SPF + DKIM + DMARC</span>
        </div>
        <div class="mf-mini-stat">
          <div class="mf-mini-stat-label">Bounce Rate</div>
          <div class="mf-mini-stat-val">0.38%</div>
          <span class="mf-badge mf-badge-info mt-1">Healthy threshold</span>
        </div>
        <div class="mf-mini-stat">
          <div class="mf-mini-stat-label">Spam Complaints</div>
          <div class="mf-mini-stat-val">0.01%</div>
          <span class="mf-badge mf-badge-success mt-1">Zero blacklists</span>
        </div>
      </div>
      <div class="p-3 rounded-3 d-flex flex-wrap gap-2 align-items-center justify-content-between" style="background:var(--mf-bg-elevated);border:1px solid var(--mf-border);">
        <span class="small" style="color:var(--mf-text-muted);">Dedicated sending pool warmed · hello@northstarlabs.io verified</span>
        <span class="mf-badge mf-badge-success">TLS 1.3 Enforced</span>
      </div>
    `
  };

  const WORKFLOW_DETAILS = [
    '<strong>Selected Node:</strong> Trial Signup Event — Latency &lt; 180ms · 4,280 contacts enrolled this month.',
    '<strong>Selected Node:</strong> Send Warm Welcome — 64.2% average open rate · Personalized with {{company_name}}.',
    '<strong>Selected Node:</strong> Wait 48h · First Send? — Splits active builders (68%) from guided nudge path (32%).',
    '<strong>Selected Node:</strong> Upgrade &amp; Tag VIP — Syncs conversion attribution directly to HubSpot CRM &amp; Stripe.'
  ];

  let perfChart = null;

  function renderHeroPreview(tab) {
    const stage = document.getElementById('mf-hero-preview-stage');
    if (!stage) return;
    stage.innerHTML = PREVIEW_VIEWS[tab] || PREVIEW_VIEWS.overview;

    document.querySelectorAll('[data-preview-tab]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-preview-tab') === tab);
    });
    document.querySelectorAll('[data-preview-side]').forEach((item) => {
      item.classList.toggle('is-active', item.getAttribute('data-preview-side') === tab);
    });
  }

  function initCounters() {
    const counters = document.querySelectorAll('.mf-counter');
    if (!counters.length) return;

    const animateCounter = (el) => {
      if (el.dataset.animated) return;
      el.dataset.animated = '1';
      const target = parseFloat(el.getAttribute('data-target')) || 0;
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = target.toFixed(decimals);
        return;
      }
      $({ val: 0 }).animate({ val: target }, {
        duration: 1300,
        easing: 'swing',
        step: function () {
          el.textContent = this.val.toFixed(decimals);
        },
        complete: function () {
          el.textContent = target.toFixed(decimals);
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });
      counters.forEach((c) => obs.observe(c));
    } else {
      counters.forEach(animateCounter);
    }
  }

  function renderPerfChart() {
    const canvas = document.getElementById('mf-home-perf-chart');
    if (!canvas || !window.Chart) return;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const textColor = isLight ? '#6B6680' : '#A6A1B5';
    const gridColor = isLight ? 'rgba(33,29,53,0.08)' : 'rgba(196,181,253,0.12)';
    const primary = isLight ? '#7C3AED' : '#8B5CF6';

    if (perfChart) perfChart.destroy();

    perfChart = new window.Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [
          {
            label: 'Open Rate (%)',
            data: [41.2, 43.8, 45.1, 46.9, 48.2, 49.4],
            borderColor: primary,
            backgroundColor: isLight ? 'rgba(124, 58, 237, 0.12)' : 'rgba(139, 92, 246, 0.18)',
            fill: true,
            tension: 0.35,
            borderWidth: 3
          },
          {
            label: 'Click-Through Rate (%)',
            data: [7.4, 8.1, 8.9, 9.8, 10.6, 11.8],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: textColor, usePointStyle: true } }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor }, beginAtZero: true }
        }
      }
    });
  }

  function initSwiper() {
    const el = document.getElementById('mf-testimonials-swiper');
    if (!el || !window.Swiper) return;
    new window.Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHeroPreview('overview');

    document.querySelectorAll('[data-preview-tab]').forEach((btn) => {
      btn.addEventListener('click', () => renderHeroPreview(btn.getAttribute('data-preview-tab')));
    });

    document.querySelectorAll('[data-wf-step]').forEach((node) => {
      node.addEventListener('click', () => {
        const idx = parseInt(node.getAttribute('data-wf-step'), 10);
        document.querySelectorAll('[data-wf-step]').forEach((n) => n.classList.remove('is-selected'));
        node.classList.add('is-selected');
        const inspector = document.getElementById('mf-home-wf-inspector');
        if (inspector) inspector.innerHTML = WORKFLOW_DETAILS[idx] || WORKFLOW_DETAILS[0];
      });
    });

    initCounters();
    renderPerfChart();
    initSwiper();
    window.addEventListener('mailflow:appearance', renderPerfChart);
  });
})(window, document, window.jQuery);

