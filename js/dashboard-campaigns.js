/* ==========================================================================
   MailFlow Dashboard Page 2 — Campaign Management
   ========================================================================== */

(function (window) {
  'use strict';

  function renderCampaigns(container) {
    let searchTerm = '';
    let statusFilter = 'All';
    let sortBy = 'newest';
    let editingId = null;

    function getFiltered() {
      const list = [...(window.MailFlowStore.getState().campaigns || [])];
      return list
        .filter((c) => {
          if (statusFilter !== 'All' && c.status !== statusFilter) return false;
          if (searchTerm && !(c.name + ' ' + c.subject + ' ' + c.list).toLowerCase().includes(searchTerm)) return false;
          return true;
        })
        .sort((a, b) => {
          if (sortBy === 'openRate') return (b.openRate || 0) - (a.openRate || 0);
          if (sortBy === 'recipients') return (b.recipients || 0) - (a.recipients || 0);
          return String(b.sentAt).localeCompare(String(a.sentAt));
        });
    }

    function draw() {
      const state = window.MailFlowStore.getState();
      const rows = getFiltered();
      const activeEdit = editingId ? state.campaigns.find((c) => c.id === editingId) : null;

      container.innerHTML = `
        <div class="row g-4">
          <!-- Create / Edit Campaign Composer -->
          <div class="col-xl-5">
            <div class="mf-card" style="height:auto;">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h5 mb-0">${activeEdit ? 'Edit Campaign' : 'Create New Campaign'}</h2>
                ${activeEdit ? '<button type="button" class="mf-btn mf-btn-ghost mf-btn-sm" id="cmp-cancel-edit">New</button>' : '<span class="mf-badge mf-badge-primary">Composer</span>'}
              </div>

              <form id="mf-campaign-form" class="d-flex flex-column gap-3" novalidate>
                <div>
                  <label class="mf-label" for="cmp-name">Campaign Name</label>
                  <input type="text" class="mf-input" id="cmp-name" value="${activeEdit ? activeEdit.name : ''}" placeholder="e.g. December Feature Roundup" required>
                </div>
                <div>
                  <label class="mf-label" for="cmp-subject">Email Subject</label>
                  <input type="text" class="mf-input" id="cmp-subject" value="${activeEdit ? activeEdit.subject : ''}" placeholder="Unlock 2x faster workflow rules" required>
                </div>
                <div class="row g-2">
                  <div class="col-sm-6">
                    <label class="mf-label" for="cmp-sender-name">Sender Name</label>
                    <input type="text" class="mf-input" id="cmp-sender-name" value="${activeEdit ? activeEdit.senderName : state.sender.name}" required>
                  </div>
                  <div class="col-sm-6">
                    <label class="mf-label" for="cmp-sender-email">Sender Email</label>
                    <input type="email" class="mf-input" id="cmp-sender-email" value="${activeEdit ? activeEdit.senderEmail : state.sender.email}" required>
                  </div>
                </div>
                <div>
                  <label class="mf-label" for="cmp-list">Select Recipient List</label>
                  <select class="mf-select" id="cmp-list">
                    <option value="Active Product Users">Active Product Users (18,420)</option>
                    <option value="VIP Trial & Customers">VIP Trial &amp; Customers (12,950)</option>
                    <option value="Newsletter Subscribers">Newsletter Subscribers (24,610)</option>
                    <option value="Enterprise Accounts">Enterprise Accounts (4,180)</option>
                  </select>
                </div>
                <div>
                  <label class="mf-label" for="cmp-body">Email Preview Content</label>
                  <textarea class="mf-textarea" id="cmp-body" rows="3" placeholder="Write the opening preview message...">${activeEdit ? activeEdit.previewBody : 'Discover what is new in your workspace this week.'}</textarea>
                </div>

                <!-- Live Email Preview Box -->
                <div class="p-3 rounded-3" style="background:var(--mf-bg-elevated);border:1px solid var(--mf-border);">
                  <div class="small fw-bold mb-1" style="color:var(--mf-primary);">Live Inbox Preview</div>
                  <div class="small fw-semibold" id="cmp-live-from">${activeEdit ? activeEdit.senderName : state.sender.name} &lt;${activeEdit ? activeEdit.senderEmail : state.sender.email}&gt;</div>
                  <div class="fw-bold small my-1" id="cmp-live-subj">${activeEdit ? activeEdit.subject : 'Your email subject appears here'}</div>
                  <div class="small" style="color:var(--mf-text-muted);" id="cmp-live-body">${activeEdit ? activeEdit.previewBody : 'Discover what is new in your workspace this week.'}</div>
                </div>

                <div class="d-flex flex-wrap gap-2">
                  <button type="button" class="mf-btn mf-btn-secondary mf-btn-sm" id="cmp-save-draft">Save Draft</button>
                  <button type="button" class="mf-btn mf-btn-primary mf-btn-sm" id="cmp-schedule">Schedule Campaign</button>
                  <button type="button" class="mf-btn mf-btn-ghost mf-btn-sm" id="cmp-test-send"><i data-lucide="send"></i> Send Test Email (Demo)</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Campaign History Table -->
          <div class="col-xl-7">
            <div class="mf-card" style="height:auto;">
              <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <h2 class="h5 mb-0">Campaign History (${rows.length})</h2>
                <div class="d-flex flex-wrap gap-2">
                  <input type="search" class="mf-input" id="cmp-search" value="${searchTerm}" placeholder="Search campaigns..." style="width:175px;padding-block:0.42rem;">
                  <select class="mf-select" id="cmp-filter-status" style="width:130px;padding-block:0.42rem;">
                    <option value="All">All Statuses</option>
                    <option value="Sent" ${statusFilter === 'Sent' ? 'selected' : ''}>Sent</option>
                    <option value="Scheduled" ${statusFilter === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                    <option value="Draft" ${statusFilter === 'Draft' ? 'selected' : ''}>Draft</option>
                    <option value="Paused" ${statusFilter === 'Paused' ? 'selected' : ''}>Paused</option>
                  </select>
                  <select class="mf-select" id="cmp-sort" style="width:135px;padding-block:0.42rem;">
                    <option value="newest" ${sortBy === 'newest' ? 'selected' : ''}>Sort: Date</option>
                    <option value="openRate" ${sortBy === 'openRate' ? 'selected' : ''}>Sort: Open Rate</option>
                    <option value="recipients" ${sortBy === 'recipients' ? 'selected' : ''}>Sort: Volume</option>
                  </select>
                </div>
              </div>

              <div class="mf-table-wrap">
                <table class="mf-table">
                  <thead>
                    <tr><th>Campaign</th><th>Status</th><th>Metrics</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    ${rows.length ? rows.map((c) => `
                      <tr>
                        <td>
                          <strong>${c.name}</strong>
                          <div class="small" style="color:var(--mf-text-muted);">${c.subject}</div>
                          <div class="small" style="color:var(--mf-text-muted);font-size:0.76rem;">${c.list} · ${c.sentAt}</div>
                        </td>
                        <td><span class="mf-badge mf-badge-${c.status === 'Sent' ? 'success' : (c.status === 'Scheduled' ? 'info' : (c.status === 'Paused' ? 'warning' : 'neutral'))}">${c.status}</span></td>
                        <td class="small">
                          <div>${c.recipients.toLocaleString()} sent</div>
                          <div style="color:var(--mf-text-muted);">${c.openRate ? c.openRate + '% open · ' + c.ctr + '% CTR' : 'Not dispatched yet'}</div>
                        </td>
                        <td>
                          <div class="d-flex gap-1">
                            <button type="button" class="mf-icon-btn" style="width:32px;height:32px;" data-cmp-edit="${c.id}" title="Edit"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                            <button type="button" class="mf-icon-btn" style="width:32px;height:32px;" data-cmp-toggle="${c.id}" title="Pause/Resume"><i data-lucide="${c.status === 'Paused' ? 'play' : 'pause'}" style="width:14px;height:14px;"></i></button>
                          </div>
                        </td>
                      </tr>
                    `).join('') : '<tr><td colspan="4" class="text-center py-4">No campaigns match your current filters.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;

      if (activeEdit) {
        document.getElementById('cmp-list').value = activeEdit.list;
      }

      // Live preview sync
      ['cmp-name', 'cmp-subject', 'cmp-sender-name', 'cmp-sender-email', 'cmp-body'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', () => {
            document.getElementById('cmp-live-from').textContent =
              `${document.getElementById('cmp-sender-name').value} <${document.getElementById('cmp-sender-email').value}>`;
            document.getElementById('cmp-live-subj').textContent =
              document.getElementById('cmp-subject').value || 'Your email subject appears here';
            document.getElementById('cmp-live-body').textContent =
              document.getElementById('cmp-body').value || '';
          });
        }
      });

      function saveCampaign(targetStatus) {
        const name = (document.getElementById('cmp-name').value || '').trim();
        const subject = (document.getElementById('cmp-subject').value || '').trim();
        const senderName = (document.getElementById('cmp-sender-name').value || '').trim();
        const senderEmail = (document.getElementById('cmp-sender-email').value || '').trim();
        const list = document.getElementById('cmp-list').value;
        const previewBody = (document.getElementById('cmp-body').value || '').trim();

        if (!name || !subject || !senderEmail) {
          window.MailFlowAppearance.toast('Please provide Campaign Name, Subject, and Sender Email.', 'error');
          return;
        }

        const payload = {
          id: editingId || 'cmp-' + Date.now(),
          name,
          subject,
          senderName,
          senderEmail,
          list,
          status: targetStatus,
          sentAt: new Date().toISOString().slice(0, 10),
          recipients: list.includes('Newsletter') ? 24610 : (list.includes('Enterprise') ? 4180 : 12950),
          openRate: 0,
          ctr: 0,
          bounceRate: 0,
          unsubscribeRate: 0,
          previewBody
        };

        window.MailFlowAjax.post('campaigns/save', payload).then(() => {
          window.MailFlowStore.setState((prev) => {
            const exists = prev.campaigns.some((c) => c.id === payload.id);
            const updated = exists
              ? prev.campaigns.map((c) => (c.id === payload.id ? Object.assign({}, c, payload) : c))
              : [payload, ...prev.campaigns];
            return { ...prev, campaigns: updated };
          });
          editingId = null;
          window.MailFlowAppearance.toast(`Campaign "${name}" saved as ${targetStatus}.`, 'success');
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      }

      document.getElementById('cmp-save-draft').addEventListener('click', () => saveCampaign('Draft'));
      document.getElementById('cmp-schedule').addEventListener('click', () => saveCampaign('Scheduled'));
      document.getElementById('cmp-test-send').addEventListener('click', () => {
        const subj = document.getElementById('cmp-subject').value || 'Untitled Campaign';
        const to = document.getElementById('cmp-sender-email').value || 'elena@northstarlabs.io';
        window.MailFlowAjax.post('campaigns/test-send', { subj, to }).then(() => {
          window.MailFlowAppearance.toast(`Demo test email simulated to ${to} ("${subj}").`, 'info');
        });
      });

      const cancelBtn = document.getElementById('cmp-cancel-edit');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => { editingId = null; draw(); if (window.lucide) window.lucide.createIcons(); });
      }

      document.getElementById('cmp-search').addEventListener('input', (e) => {
        searchTerm = e.target.value.trim().toLowerCase();
        draw();
        if (window.lucide) window.lucide.createIcons();
      });
      document.getElementById('cmp-filter-status').addEventListener('change', (e) => {
        statusFilter = e.target.value;
        draw();
        if (window.lucide) window.lucide.createIcons();
      });
      document.getElementById('cmp-sort').addEventListener('change', (e) => {
        sortBy = e.target.value;
        draw();
        if (window.lucide) window.lucide.createIcons();
      });

      container.querySelectorAll('[data-cmp-edit]').forEach((btn) => {
        btn.addEventListener('click', () => {
          editingId = btn.getAttribute('data-cmp-edit');
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });

      container.querySelectorAll('[data-cmp-toggle]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-cmp-toggle');
          window.MailFlowStore.setState((prev) => ({
            ...prev,
            campaigns: prev.campaigns.map((c) => {
              if (c.id !== id) return c;
              const nextStatus = c.status === 'Paused' ? 'Scheduled' : 'Paused';
              return { ...c, status: nextStatus };
            })
          }));
          window.MailFlowAppearance.toast('Campaign status updated.', 'info');
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });
    }

    draw();
  }

  window.MailFlowDash.registerView('campaigns', renderCampaigns);
})(window);

