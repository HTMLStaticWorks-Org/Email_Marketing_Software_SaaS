/* ==========================================================================
   MailFlow Dashboard Page 1 — Overview
   ========================================================================== */

(function (window) {
  'use strict';

  function renderOverview(container) {
    const state = window.MailFlowStore.getState();
    const campaigns = state.campaigns || [];
    const contacts = state.contacts || [];
    const totalSent = campaigns.reduce((acc, c) => acc + (c.status === 'Sent' ? c.recipients : 0), 0);
    const sentList = campaigns.filter((c) => c.status === 'Sent');
    const avgOpen = sentList.length ? (sentList.reduce((a, c) => a + c.openRate, 0) / sentList.length).toFixed(1) : '0.0';
    const avgCtr = sentList.length ? (sentList.reduce((a, c) => a + c.ctr, 0) / sentList.length).toFixed(1) : '0.0';
    const activeCount = campaigns.filter((c) => c.status === 'Sent' || c.status === 'Scheduled').length;
    const newCount = contacts.filter((c) => c.status === 'New').length;

    const statusCounts = {
      Sent: campaigns.filter((c) => c.status === 'Sent').length,
      Scheduled: campaigns.filter((c) => c.status === 'Scheduled').length,
      Draft: campaigns.filter((c) => c.status === 'Draft').length,
      Paused: campaigns.filter((c) => c.status === 'Paused').length
    };

    container.innerHTML = `
      <!-- Quick Action Bar -->
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 class="h4 mb-1">Welcome back, ${state.session.user.name}</h2>
          <p class="small mb-0">Here is your live campaign telemetry and subscriber velocity across ${state.session.user.company}.</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="mf-btn mf-btn-primary mf-btn-sm" data-quick-nav="campaigns"><i data-lucide="plus"></i> New Campaign</button>
          <button type="button" class="mf-btn mf-btn-secondary mf-btn-sm" data-quick-nav="builder"><i data-lucide="layout-template"></i> Email Builder</button>
          <button type="button" class="mf-btn mf-btn-secondary mf-btn-sm" data-quick-nav="contacts"><i data-lucide="user-plus"></i> Import Contacts</button>
          <button type="button" class="mf-btn mf-btn-ghost mf-btn-sm" data-quick-nav="automation"><i data-lucide="git-branch"></i> Automation</button>
        </div>
      </div>

      <!-- 6 Required KPI Cards -->
      <div class="mf-kpi-grid mb-4">
        <div class="mf-card mf-kpi-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="small" style="color:var(--mf-text-muted);">Total Contacts</span>
            <span class="mf-badge mf-badge-primary">+${newCount} new</span>
          </div>
          <div class="mf-kpi-val">${(contacts.length * 1842).toLocaleString()}</div>
          <div class="small mt-1" style="color:var(--mf-text-muted);">${contacts.length} sample profiles loaded locally</div>
        </div>

        <div class="mf-card mf-kpi-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="small" style="color:var(--mf-text-muted);">Emails Sent</span>
            <span class="mf-badge mf-badge-success">+18.4%</span>
          </div>
          <div class="mf-kpi-val">${totalSent.toLocaleString()}</div>
          <div class="small mt-1" style="color:var(--mf-text-muted);">99.5% delivered cleanly</div>
        </div>

        <div class="mf-card mf-kpi-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="small" style="color:var(--mf-text-muted);">Open Rate</span>
            <span class="mf-badge mf-badge-success">+3.2%</span>
          </div>
          <div class="mf-kpi-val">${avgOpen}%</div>
          <div class="small mt-1" style="color:var(--mf-text-muted);">Above SaaS industry 36% avg</div>
        </div>

        <div class="mf-card mf-kpi-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="small" style="color:var(--mf-text-muted);">Click-through Rate</span>
            <span class="mf-badge mf-badge-info">+1.9%</span>
          </div>
          <div class="mf-kpi-val">${avgCtr}%</div>
          <div class="small mt-1" style="color:var(--mf-text-muted);">Strong CTA engagement</div>
        </div>

        <div class="mf-card mf-kpi-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="small" style="color:var(--mf-text-muted);">Active Campaigns</span>
            <span class="mf-badge mf-badge-primary">Live</span>
          </div>
          <div class="mf-kpi-val">${activeCount}</div>
          <div class="small mt-1" style="color:var(--mf-text-muted);">${statusCounts.Scheduled} scheduled · ${statusCounts.Draft} drafts</div>
        </div>

        <div class="mf-card mf-kpi-card">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="small" style="color:var(--mf-text-muted);">Subscriber Growth</span>
            <span class="mf-badge mf-badge-success">MoM</span>
          </div>
          <div class="mf-kpi-val">+14.8%</div>
          <div class="small mt-1" style="color:var(--mf-text-muted);">+2,140 net opt-ins this month</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row g-4 mb-4">
        <div class="col-lg-6">
          <div class="mf-card">
            <h3 class="h6 mb-1">Subscriber Growth</h3>
            <p class="small mb-3">Monthly net new subscribers across opt-in sources</p>
            <div style="position:relative;height:260px;"><canvas id="mf-ov-growth-chart"></canvas></div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="mf-card">
            <h3 class="h6 mb-1">Campaign Performance</h3>
            <p class="small mb-3">Open rate (%) vs Click-through rate (%) per sent campaign</p>
            <div style="position:relative;height:260px;"><canvas id="mf-ov-perf-chart"></canvas></div>
          </div>
        </div>
      </div>

      <!-- Recent Campaigns, Status Overview & Activity -->
      <div class="row g-4">
        <div class="col-xl-8">
          <div class="mf-card">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h3 class="h6 mb-0">Recent Campaigns</h3>
              <button type="button" class="mf-btn mf-btn-ghost mf-btn-sm" data-quick-nav="campaigns">View All</button>
            </div>
            <div class="mf-table-wrap">
              <table class="mf-table">
                <thead>
                  <tr><th>Campaign</th><th>Status</th><th>Recipients</th><th>Open</th><th>CTR</th></tr>
                </thead>
                <tbody>
                  ${campaigns.slice(0, 5).map((c) => `
                    <tr>
                      <td><strong>${c.name}</strong><div class="small" style="color:var(--mf-text-muted);">${c.list}</div></td>
                      <td><span class="mf-badge mf-badge-${c.status === 'Sent' ? 'success' : (c.status === 'Scheduled' ? 'info' : (c.status === 'Paused' ? 'warning' : 'neutral'))}">${c.status}</span></td>
                      <td>${c.recipients.toLocaleString()}</td>
                      <td>${c.openRate ? c.openRate + '%' : '—'}</td>
                      <td>${c.ctr ? c.ctr + '%' : '—'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-xl-4 d-flex flex-column gap-4">
          <div class="mf-card" style="height:auto;">
            <h3 class="h6 mb-3">Campaign Status Overview</h3>
            <div class="d-flex flex-column gap-2">
              <div class="d-flex justify-content-between small"><span>Sent</span><strong>${statusCounts.Sent}</strong></div>
              <div class="d-flex justify-content-between small"><span>Scheduled</span><strong>${statusCounts.Scheduled}</strong></div>
              <div class="d-flex justify-content-between small"><span>Draft</span><strong>${statusCounts.Draft}</strong></div>
              <div class="d-flex justify-content-between small"><span>Paused</span><strong>${statusCounts.Paused}</strong></div>
            </div>
          </div>

          <div class="mf-card">
            <h3 class="h6 mb-3">Recent Activity</h3>
            <div class="d-flex flex-column gap-3">
              ${(state.recentActivity || []).map((a) => `
                <div class="small pb-2 border-bottom" style="border-color:var(--mf-border) !important;">
                  <div style="color:var(--mf-text);">${a.text}</div>
                  <div style="color:var(--mf-text-muted);font-size:0.75rem;">${a.time}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-quick-nav]').forEach((btn) => {
      btn.addEventListener('click', () => window.MailFlowDash.navigate(btn.getAttribute('data-quick-nav')));
    });

    if (window.Chart) {
      const c = window.MailFlowDash.getChartColors();
      const gCtx = document.getElementById('mf-ov-growth-chart');
      if (gCtx) {
        window.MailFlowDash.registerChart(new window.Chart(gCtx, {
          type: 'line',
          data: {
            labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            datasets: [{
              label: 'Total Contacts',
              data: [9400, 10650, 11800, 12900, 13850, 14736],
              borderColor: c.primary,
              backgroundColor: c.isLight ? 'rgba(124,58,237,0.12)' : 'rgba(139,92,246,0.2)',
              fill: true,
              tension: 0.35
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: c.text } } },
            scales: {
              x: { ticks: { color: c.text }, grid: { color: c.grid } },
              y: { ticks: { color: c.text }, grid: { color: c.grid } }
            }
          }
        }));
      }

      const pCtx = document.getElementById('mf-ov-perf-chart');
      if (pCtx) {
        window.MailFlowDash.registerChart(new window.Chart(pCtx, {
          type: 'bar',
          data: {
            labels: sentList.map((s) => s.name.split(' ').slice(0, 2).join(' ')),
            datasets: [
              { label: 'Open Rate %', data: sentList.map((s) => s.openRate), backgroundColor: c.primary, borderRadius: 6 },
              { label: 'CTR %', data: sentList.map((s) => s.ctr), backgroundColor: c.success, borderRadius: 6 }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: c.text } } },
            scales: {
              x: { ticks: { color: c.text }, grid: { color: c.grid } },
              y: { ticks: { color: c.text }, grid: { color: c.grid }, beginAtZero: true }
            }
          }
        }));
      }
    }
  }

  window.MailFlowDash.registerView('overview', renderOverview);
})(window);

