/* ==========================================================================
   MailFlow Home 2 Interactive Logic (Studio Tabs, ROI Calculator, Playbooks)
   ========================================================================== */

(function (window, document) {
  'use strict';

  const STUDIO_TABS = {
    email: `
      <div class="p-3 rounded-3" style="background:var(--mf-bg-elevated);border:1px solid var(--mf-border);">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="mf-badge mf-badge-primary">Welcome Flow · Step 1</span>
          <span class="small" style="color:var(--mf-text-muted);">64.2% Avg. Open</span>
        </div>
        <h3 class="h5 mb-2">Welcome to Northstar Labs, {{first_name}}!</h3>
        <p class="small mb-3">Your workspace is live. Connect your custom domain or import your first subscriber segment in under 2 minutes.</p>
        <div class="d-flex flex-wrap gap-2">
          <a href="dashboard.html#builder" class="mf-btn mf-btn-primary mf-btn-sm">Customize in Builder</a>
          <a href="dashboard.html#templates" class="mf-btn mf-btn-secondary mf-btn-sm">Browse Templates</a>
        </div>
      </div>
    `,
    event: `
      <pre class="mf-h2-code">{
  "event": "workspace.trial_started",
  "contact": {
    "email": "elena@northstarlabs.io",
    "plan": "Growth",
    "locale": "en-US"
  },
  "trigger_flow": "wf-welcome-2026",
  "dispatch_latency_ms": 142
}</pre>
    `,
    metrics: `
      <div class="mf-card-grid mf-card-grid-2">
        <div class="p-3 rounded-3" style="background:var(--mf-bg-elevated);border:1px solid var(--mf-border);">
          <div class="small" style="color:var(--mf-text-muted);">Trial-to-Paid Lift</div>
          <div class="h4 mb-0" style="color:var(--mf-success);">+41.2%</div>
        </div>
        <div class="p-3 rounded-3" style="background:var(--mf-bg-elevated);border:1px solid var(--mf-border);">
          <div class="small" style="color:var(--mf-text-muted);">Unsubscribe Rate</div>
          <div class="h4 mb-0">0.11%</div>
        </div>
      </div>
      <div class="mt-3 p-3 rounded-3 small" style="background:var(--mf-bg-elevated);border:1px solid var(--mf-border);">
        <strong>Active Cohort:</strong> 4,280 subscribers enrolled · 99.5% inbox delivery verified.
      </div>
    `
  };

  const PLAYBOOKS = {
    saas: {
      badge: 'SaaS & DevTools',
      title: 'Convert Free Signups Into Long-Term Annual Customers',
      desc: 'Trigger personalized onboarding nudges when a user invites a teammate, connects an integration, or approaches usage limits.',
      bullets: ['Trial expiration countdown sequence', 'Feature adoption & product digest', 'Failed payment Stripe dunning flow'],
      img: 'assets/img/a%20(24).jpg',
      alt: 'SaaS email automation code and workflow laptop'
    },
    ecommerce: {
      badge: 'Ecommerce & DTC',
      title: 'Recover Abandoned Carts & Grow Repeat Purchase Value',
      desc: 'Sync Shopify and WooCommerce order events to send dynamic cart reminders, VIP early access, and post-delivery reviews.',
      bullets: ['1-hour high-intent cart recovery', 'VIP customer win-back & birthday offers', 'Back-in-stock product alerts'],
      img: 'assets/img/a%20(19).jpg',
      alt: 'Mobile ecommerce email campaign preview'
    },
    agencies: {
      badge: 'Agencies & Media',
      title: 'Deliver High-Open Editorial Newsletters at Scale',
      desc: 'Manage clean subscriber lists, test subject lines automatically, and export crystal-clear client performance reports.',
      bullets: ['Automated A/B subject testing', 'Engagement-based list sunsetting', 'Multi-segment newsletter digests'],
      img: 'assets/img/a%20(16).jpg',
      alt: 'Email campaign calendar and mobile newsletter schedule'
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const studioBody = document.getElementById('mf-h2-studio-body');
    function renderStudio(tab) {
      if (!studioBody) return;
      studioBody.innerHTML = STUDIO_TABS[tab] || STUDIO_TABS.email;
      document.querySelectorAll('[data-h2-tab]').forEach((b) => {
        b.classList.toggle('is-active', b.getAttribute('data-h2-tab') === tab);
      });
    }
    renderStudio('email');
    document.querySelectorAll('[data-h2-tab]').forEach((btn) => {
      btn.addEventListener('click', () => renderStudio(btn.getAttribute('data-h2-tab')));
    });

    // Interactive ROI Estimator
    const subsInput = document.getElementById('h2-subs-range');
    const sendsInput = document.getElementById('h2-sends-range');
    function updateRoi() {
      if (!subsInput || !sendsInput) return;
      const subs = parseInt(subsInput.value, 10) || 25000;
      const touches = parseInt(sendsInput.value, 10) || 6;
      const totalSends = subs * touches;
      const estClicks = Math.round(totalSends * 0.486 * 0.118);
      const estRev = Math.round(estClicks * 1.4);
      document.getElementById('h2-subs-val').textContent = subs.toLocaleString();
      document.getElementById('h2-sends-val').textContent = touches;
      document.getElementById('h2-out-sends').textContent = totalSends.toLocaleString();
      document.getElementById('h2-out-clicks').textContent = estClicks.toLocaleString();
      document.getElementById('h2-out-rev').textContent = '$' + estRev.toLocaleString();
    }
    if (subsInput && sendsInput) {
      subsInput.addEventListener('input', updateRoi);
      sendsInput.addEventListener('input', updateRoi);
      updateRoi();
    }

    // Playbooks
    const pbStage = document.getElementById('mf-h2-playbook-stage');
    function renderPlaybook(key) {
      const p = PLAYBOOKS[key] || PLAYBOOKS.saas;
      if (!pbStage) return;
      pbStage.innerHTML = `
        <div class="mf-split-panel">
          <div>
            <span class="mf-badge mf-badge-primary mb-3">${p.badge}</span>
            <h3 class="h4">${p.title}</h3>
            <p>${p.desc}</p>
            <ul class="mf-check-list mb-4">
              ${p.bullets.map((b) => `<li><i data-lucide="check-circle-2"></i><span>${b}</span></li>`).join('')}
            </ul>
            <a href="dashboard.html#templates" class="mf-btn mf-btn-primary btn-sm">Explore ${p.badge} Templates</a>
          </div>
          <div class="mf-media-frame">
            <img src="${p.img}" alt="${p.alt}" loading="eager">
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons({ root: pbStage });
      document.querySelectorAll('.mf-playbook-btn').forEach((btn) => {
        const active = btn.getAttribute('data-playbook') === key;
        btn.classList.toggle('mf-btn-primary', active);
        btn.classList.toggle('mf-btn-secondary', !active);
      });
    }
    renderPlaybook('saas');
    document.querySelectorAll('.mf-playbook-btn').forEach((btn) => {
      btn.addEventListener('click', () => renderPlaybook(btn.getAttribute('data-playbook')));
    });
  });
})(window, document);

