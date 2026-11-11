/* ==========================================================================
   MailFlow Dashboard Pages 8, 9 & 10 — Analytics, Integrations & Settings
   ========================================================================== */

(function (window) {
  'use strict';

  function renderAnalytics(container) {
    let range = '30d';

    const RANGE_MULTIPLIER = {
      '7d': { label: 'Last 7 Days', sent: '38,420', open: '51.2%', ctr: '12.4%', bounce: '0.32%', unsub: '0.09%', deliv: '99.6%', points: [46, 48, 49, 50, 51, 51.2] },
      '30d': { label: 'Last 30 Days', sent: '142,840', open: '49.4%', ctr: '11.8%', bounce: '0.40%', unsub: '0.12%', deliv: '99.5%', points: [42, 44, 46, 47, 48.5, 49.4] },
      '90d': { label: 'Last 90 Days', sent: '412,900', open: '47.1%', ctr: '10.9%', bounce: '0.44%', unsub: '0.15%', deliv: '99.4%', points: [39, 41, 43, 45, 46.2, 47.1] },
      '12m': { label: 'Last 12 Months', sent: '1,680,200', open: '45.8%', ctr: '10.2%', bounce: '0.48%', unsub: '0.17%', deliv: '99.3%', points: [36, 39, 41, 43, 44.6, 45.8] }
    };

    function draw() {
      const state = window.MailFlowStore.getState();
      const sentCampaigns = (state.campaigns || []).filter((c) => c.status === 'Sent');
      const m = RANGE_MULTIPLIER[range] || RANGE_MULTIPLIER['30d'];

      container.innerHTML = `
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h2 class="h5 mb-1">Deliverability &amp; Campaign Intelligence</h2>
            <p class="small mb-0">Showing cohort metrics for <strong>${m.label}</strong></p>
          </div>
          <div class="d-flex gap-2">
            <select class="mf-select" id="an-date-range" style="width:170px;padding-block:0.45rem;">
              <option value="7d" ${range === '7d' ? 'selected' : ''}>Last 7 Days</option>
              <option value="30d" ${range === '30d' ? 'selected' : ''}>Last 30 Days</option>
              <option value="90d" ${range === '90d' ? 'selected' : ''}>Last 90 Days</option>
              <option value="12m" ${range === '12m' ? 'selected' : ''}>Last 12 Months</option>
            </select>
          </div>
        </div>

        <!-- 6 Analytics KPIs -->
        <div class="mf-kpi-grid mb-4">
          <div class="mf-card mf-kpi-card"><div class="small" style="color:var(--mf-text-muted);">Open Rate</div><div class="mf-kpi-val">${m.open}</div></div>
          <div class="mf-card mf-kpi-card"><div class="small" style="color:var(--mf-text-muted);">Click-through Rate</div><div class="mf-kpi-val">${m.ctr}</div></div>
          <div class="mf-card mf-kpi-card"><div class="small" style="color:var(--mf-text-muted);">Bounce Rate</div><div class="mf-kpi-val">${m.bounce}</div></div>
          <div class="mf-card mf-kpi-card"><div class="small" style="color:var(--mf-text-muted);">Unsubscribe Rate</div><div class="mf-kpi-val">${m.unsub}</div></div>
          <div class="mf-card mf-kpi-card"><div class="small" style="color:var(--mf-text-muted);">Delivery Rate</div><div class="mf-kpi-val" style="color:var(--mf-success);">${m.deliv}</div></div>
          <div class="mf-card mf-kpi-card"><div class="small" style="color:var(--mf-text-muted);">Total Emails Sent</div><div class="mf-kpi-val">${m.sent}</div></div>
        </div>

        <!-- 3 Charts -->
        <div class="row g-4 mb-4">
          <div class="col-lg-6">
            <div class="mf-card">
              <h3 class="h6 mb-3">Campaign Performance Trend</h3>
              <div style="position:relative;height:250px;"><canvas id="an-perf-chart"></canvas></div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="mf-card">
              <h3 class="h6 mb-3">Open vs Click Comparison</h3>
              <div style="position:relative;height:250px;"><canvas id="an-open-click-chart"></canvas></div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-5">
            <div class="mf-card">
              <h3 class="h6 mb-3">Subscriber Growth</h3>
              <div style="position:relative;height:230px;"><canvas id="an-sub-chart"></canvas></div>
            </div>
          </div>
          <div class="col-lg-7">
            <div class="mf-card">
              <h3 class="h6 mb-3">Best Performing Campaigns &amp; Comparison</h3>
              <div class="mf-table-wrap">
                <table class="mf-table">
                  <thead><tr><th>Campaign</th><th>Sent</th><th>Open Rate</th><th>CTR</th><th>Bounce</th></tr></thead>
                  <tbody>
                    ${sentCampaigns.sort((a, b) => b.openRate - a.openRate).map((c) => `
                      <tr>
                        <td><strong>${c.name}</strong></td>
                        <td>${c.recipients.toLocaleString()}</td>
                        <td><span class="mf-badge mf-badge-success">${c.openRate}%</span></td>
                        <td>${c.ctr}%</td>
                        <td>${c.bounceRate}%</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('an-date-range').addEventListener('change', (e) => {
        range = e.target.value;
        draw();
      });

      if (window.Chart) {
        const c = window.MailFlowDash.getChartColors();
        const pCtx = document.getElementById('an-perf-chart');
        if (pCtx) {
          window.MailFlowDash.registerChart(new window.Chart(pCtx, {
            type: 'line',
            data: {
              labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'Current'],
              datasets: [{ label: 'Open Rate %', data: m.points, borderColor: c.primary, backgroundColor: c.isLight ? 'rgba(124,58,237,0.12)' : 'rgba(139,92,246,0.2)', fill: true, tension: 0.35 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: c.text } } }, scales: { x: { ticks: { color: c.text }, grid: { color: c.grid } }, y: { ticks: { color: c.text }, grid: { color: c.grid } } } }
          }));
        }

        const ocCtx = document.getElementById('an-open-click-chart');
        if (ocCtx) {
          window.MailFlowDash.registerChart(new window.Chart(ocCtx, {
            type: 'bar',
            data: {
              labels: sentCampaigns.map((s) => s.name.split(' ').slice(0, 2).join(' ')),
              datasets: [
                { label: 'Open %', data: sentCampaigns.map((s) => s.openRate), backgroundColor: c.primary, borderRadius: 6 },
                { label: 'Click %', data: sentCampaigns.map((s) => s.ctr), backgroundColor: c.info, borderRadius: 6 }
              ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: c.text } } }, scales: { x: { ticks: { color: c.text }, grid: { color: c.grid } }, y: { ticks: { color: c.text }, grid: { color: c.grid } } } }
          }));
        }

        const sCtx = document.getElementById('an-sub-chart');
        if (sCtx) {
          window.MailFlowDash.registerChart(new window.Chart(sCtx, {
            type: 'bar',
            data: {
              labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
              datasets: [{ label: 'Net New Subscribers', data: [1120, 1450, 1680, 1890, 2140], backgroundColor: c.success, borderRadius: 6 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: c.text } } }, scales: { x: { ticks: { color: c.text }, grid: { color: c.grid } }, y: { ticks: { color: c.text }, grid: { color: c.grid } } } }
          }));
        }
      }
    }

    draw();
  }

  function renderIntegrations(container) {
    let activeCat = 'All';
    const cats = ['All', 'Ecommerce', 'CRM', 'Analytics', 'Website Platforms', 'Payment Platforms', 'Automation Tools'];

    function draw() {
      const integrations = window.MailFlowStore.getState().integrations || [];
      const rows = integrations.filter((i) => activeCat === 'All' || i.category === activeCat);

      container.innerHTML = `
        <div class="d-flex flex-wrap gap-2 mb-4">
          ${cats.map((c) => `<button type="button" class="mf-btn ${c === activeCat ? 'mf-btn-primary' : 'mf-btn-secondary'} mf-btn-sm" data-int-cat="${c}">${c}</button>`).join('')}
        </div>

        <div class="mf-card-grid mf-card-grid-3">
          ${rows.map((item) => `
            <article class="mf-card mf-card-interactive">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="mf-card-icon mb-0"><i data-lucide="${item.icon}"></i></div>
                <span class="mf-badge mf-badge-${item.connected ? 'success' : 'neutral'}">${item.connected ? 'Connected' : item.category}</span>
              </div>
              <div class="mf-card-body">
                <h3 class="h5 mb-1">${item.name}</h3>
                <p class="small mb-0">${item.desc}</p>
              </div>
              <div class="mf-card-footer">
                <button type="button" class="mf-btn ${item.connected ? 'mf-btn-secondary' : 'mf-btn-primary'} mf-btn-sm w-100" data-int-toggle="${item.id}">
                  ${item.connected ? 'Disconnect (Demo)' : 'Connect Integration'}
                </button>
              </div>
            </article>
          `).join('')}
        </div>
      `;

      container.querySelectorAll('[data-int-cat]').forEach((btn) => {
        btn.addEventListener('click', () => {
          activeCat = btn.getAttribute('data-int-cat');
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });

      container.querySelectorAll('[data-int-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-int-toggle');
          const target = integrations.find((x) => x.id === id);
          if (!target) return;
          window.MailFlowAjax.post('integrations/toggle', { id, connected: !target.connected }).then(() => {
            window.MailFlowStore.setState((prev) => ({
              ...prev,
              integrations: prev.integrations.map((x) => (x.id === id ? { ...x, connected: !x.connected } : x))
            }));
            window.MailFlowAppearance.toast(`${target.name} ${!target.connected ? 'connected' : 'disconnected'} in demo workspace.`, 'success');
            draw();
            if (window.lucide) window.lucide.createIcons();
          });
        });
      });
    }

    draw();
  }

  function renderSettings(container) {
    const state = window.MailFlowStore.getState();
    const u = state.session.user;
    const s = state.sender;
    const n = state.notifications;

    container.innerHTML = `
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="mf-card" style="height:auto;">
            <h2 class="h5 mb-3">Profile &amp; Account Information</h2>
            <form id="set-profile-form" class="d-flex flex-column gap-3">
              <div><label class="mf-label">Full Name</label><input type="text" class="mf-input" id="set-name" value="${u.name}" required></div>
              <div><label class="mf-label">Account Email</label><input type="email" class="mf-input" id="set-email" value="${u.email}" required></div>
              <div class="row g-2">
                <div class="col-sm-6"><label class="mf-label">Company Name</label><input type="text" class="mf-input" id="set-company" value="${u.company}"></div>
                <div class="col-sm-6"><label class="mf-label">Role</label><input type="text" class="mf-input" id="set-role" value="${u.role}"></div>
              </div>
              <button type="submit" class="mf-btn mf-btn-primary mf-btn-sm align-self-start">Save Profile</button>
            </form>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="mf-card" style="height:auto;">
            <h2 class="h5 mb-3">Sender Information &amp; Email Preferences</h2>
            <form id="set-sender-form" class="d-flex flex-column gap-3">
              <div><label class="mf-label">Default Sender Name</label><input type="text" class="mf-input" id="set-sname" value="${s.name}" required></div>
              <div><label class="mf-label">Default From Email</label><input type="email" class="mf-input" id="set-semail" value="${s.email}" required></div>
              <div><label class="mf-label">Reply-To Address</label><input type="email" class="mf-input" id="set-reply" value="${s.replyTo}" required></div>
              <button type="submit" class="mf-btn mf-btn-primary mf-btn-sm align-self-start">Save Sender Info</button>
            </form>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="mf-card" style="height:auto;">
            <h2 class="h5 mb-3">Notification Settings &amp; Password Management</h2>
            <div class="d-flex flex-column gap-2 mb-4">
              <label class="d-flex align-items-center justify-content-between small p-2 rounded" style="background:var(--mf-bg-elevated);">
                <span>Campaign Sent Alerts</span>
                <input type="checkbox" class="form-check-input" id="set-n-sent" ${n.campaignSent ? 'checked' : ''}>
              </label>
              <label class="d-flex align-items-center justify-content-between small p-2 rounded" style="background:var(--mf-bg-elevated);">
                <span>Weekly Deliverability Digest</span>
                <input type="checkbox" class="form-check-input" id="set-n-weekly" ${n.weeklyDigest ? 'checked' : ''}>
              </label>
              <label class="d-flex align-items-center justify-content-between small p-2 rounded" style="background:var(--mf-bg-elevated);">
                <span>Bounce Threshold Warnings</span>
                <input type="checkbox" class="form-check-input" id="set-n-bounce" ${n.bounceAlerts ? 'checked' : ''}>
              </label>
            </div>
            <form id="set-pass-form" class="d-flex flex-column gap-2">
              <label class="mf-label">Update Demo Password</label>
              <div class="d-flex gap-2">
                <input type="password" class="mf-input" id="set-new-pass" placeholder="New password (min 6 chars)">
                <button type="submit" class="mf-btn mf-btn-secondary mf-btn-sm">Update</button>
              </div>
            </form>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="mf-card" style="height:auto;">
            <h2 class="h5 mb-3">Appearance Settings &amp; Workspace Actions</h2>
            <div class="d-flex flex-wrap gap-2 mb-4">
              <button type="button" class="mf-btn ${state.theme === 'dark' ? 'mf-btn-primary' : 'mf-btn-secondary'} mf-btn-sm" id="set-theme-dark">Dark Mode</button>
              <button type="button" class="mf-btn ${state.theme === 'light' ? 'mf-btn-primary' : 'mf-btn-secondary'} mf-btn-sm" id="set-theme-light">Light Mode</button>
              <button type="button" class="mf-btn ${state.dir === 'ltr' ? 'mf-btn-primary' : 'mf-btn-secondary'} mf-btn-sm" id="set-dir-ltr">LTR (English)</button>
              <button type="button" class="mf-btn ${state.dir === 'rtl' ? 'mf-btn-primary' : 'mf-btn-secondary'} mf-btn-sm" id="set-dir-rtl">RTL (العربية)</button>
            </div>
            <div class="d-flex flex-wrap gap-2 pt-3 border-top" style="border-color:var(--mf-border) !important;">
              <button type="button" class="mf-btn mf-btn-ghost mf-btn-sm" id="set-reset-demo">Reset Demo Data</button>
              <button type="button" class="mf-btn mf-btn-secondary mf-btn-sm" style="color:var(--mf-danger);" id="set-logout-btn"><i data-lucide="log-out"></i> Logout</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('set-profile-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedUser = {
        ...u,
        name: document.getElementById('set-name').value.trim(),
        email: document.getElementById('set-email').value.trim(),
        company: document.getElementById('set-company').value.trim(),
        role: document.getElementById('set-role').value.trim()
      };
      window.MailFlowAjax.post('settings/profile', updatedUser).then(() => {
        window.MailFlowStore.setState((prev) => ({ ...prev, session: { ...prev.session, user: updatedUser } }));
        window.MailFlowDash.refreshTopbar();
        window.MailFlowAppearance.toast('Profile settings saved.', 'success');
      });
    });

    document.getElementById('set-sender-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const sender = {
        ...s,
        name: document.getElementById('set-sname').value.trim(),
        email: document.getElementById('set-semail').value.trim(),
        replyTo: document.getElementById('set-reply').value.trim()
      };
      window.MailFlowAjax.post('settings/sender', sender).then(() => {
        window.MailFlowStore.setState({ sender });
        window.MailFlowAppearance.toast('Sender preferences updated.', 'success');
      });
    });

    ['set-n-sent', 'set-n-weekly', 'set-n-bounce'].forEach((id) => {
      document.getElementById(id).addEventListener('change', () => {
        window.MailFlowStore.setState((prev) => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            campaignSent: document.getElementById('set-n-sent').checked,
            weeklyDigest: document.getElementById('set-n-weekly').checked,
            bounceAlerts: document.getElementById('set-n-bounce').checked
          }
        }));
        window.MailFlowAppearance.toast('Notification preference saved.', 'info');
      });
    });

    document.getElementById('set-pass-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('set-new-pass').value;
      if (val.length < 6) {
        window.MailFlowAppearance.toast('Password must be at least 6 characters.', 'error');
        return;
      }
      document.getElementById('set-new-pass').value = '';
      window.MailFlowAppearance.toast('Demo password updated locally.', 'success');
    });

    document.getElementById('set-theme-dark').addEventListener('click', () => window.MailFlowAppearance.setTheme('dark'));
    document.getElementById('set-theme-light').addEventListener('click', () => window.MailFlowAppearance.setTheme('light'));
    document.getElementById('set-dir-ltr').addEventListener('click', () => window.MailFlowAppearance.setDirection('ltr'));
    document.getElementById('set-dir-rtl').addEventListener('click', () => window.MailFlowAppearance.setDirection('rtl'));

    document.getElementById('set-reset-demo').addEventListener('click', () => {
      window.MailFlowStore.resetDemoData();
      window.MailFlowAppearance.toast('Demo data reset to defaults.', 'info');
      window.MailFlowDash.navigate('overview');
    });

    document.getElementById('set-logout-btn').addEventListener('click', window.MailFlowDash.handleLogout);
  }

  window.MailFlowDash.registerView('analytics', renderAnalytics);
  window.MailFlowDash.registerView('integrations', renderIntegrations);
  window.MailFlowDash.registerView('settings', renderSettings);
})(window);

