/* ==========================================================================
   MailFlow Dashboard Pages 4 & 5 — Contact Management & Segments
   ========================================================================== */

(function (window) {
  'use strict';

  function renderContacts(container) {
    let search = '';
    let statusFilter = 'All';
    let groupFilter = 'All';

    function draw() {
      const contacts = window.MailFlowStore.getState().contacts || [];
      const activeCount = contacts.filter((c) => c.status === 'Active').length;
      const unsubCount = contacts.filter((c) => c.status === 'Unsubscribed').length;
      const newCount = contacts.filter((c) => c.status === 'New').length;
      const groups = ['All', ...new Set(contacts.map((c) => c.group))];

      const filtered = contacts.filter((c) => {
        if (statusFilter !== 'All' && c.status !== statusFilter) return false;
        if (groupFilter !== 'All' && c.group !== groupFilter) return false;
        if (search && !(c.name + ' ' + c.email + ' ' + c.company + ' ' + (c.tags || []).join(' ')).toLowerCase().includes(search)) return false;
        return true;
      });

      container.innerHTML = `
        <!-- 4 Summary Stats -->
        <div class="mf-card-grid mf-card-grid-4 mb-4">
          <div class="mf-card mf-kpi-card"><div class="small" style="color:var(--mf-text-muted);">Total Contacts</div><div class="mf-kpi-val">${contacts.length}</div></div>
          <div class="mf-card mf-kpi-card"><div class="small" style="color:var(--mf-text-muted);">Active Subscribers</div><div class="mf-kpi-val" style="color:var(--mf-success);">${activeCount}</div></div>
          <div class="mf-card mf-kpi-card"><div class="small" style="color:var(--mf-text-muted);">Unsubscribed Contacts</div><div class="mf-kpi-val" style="color:var(--mf-warning);">${unsubCount}</div></div>
          <div class="mf-card mf-kpi-card"><div class="small" style="color:var(--mf-text-muted);">New Contacts</div><div class="mf-kpi-val" style="color:var(--mf-primary);">${newCount}</div></div>
        </div>

        <div class="mf-card" style="height:auto;">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div class="d-flex flex-wrap gap-2">
              <input type="search" class="mf-input" id="cnt-search" value="${search}" placeholder="Search name, email, tag..." style="width:220px;padding-block:0.45rem;">
              <select class="mf-select" id="cnt-status" style="width:140px;padding-block:0.45rem;">
                <option value="All">All Statuses</option>
                <option value="Active" ${statusFilter === 'Active' ? 'selected' : ''}>Active</option>
                <option value="New" ${statusFilter === 'New' ? 'selected' : ''}>New</option>
                <option value="Unsubscribed" ${statusFilter === 'Unsubscribed' ? 'selected' : ''}>Unsubscribed</option>
              </select>
              <select class="mf-select" id="cnt-group" style="width:170px;padding-block:0.45rem;">
                ${groups.map((g) => `<option value="${g}" ${groupFilter === g ? 'selected' : ''}>${g === 'All' ? 'All Groups' : g}</option>`).join('')}
              </select>
            </div>
            <div class="d-flex flex-wrap gap-2">
              <button type="button" class="mf-btn mf-btn-secondary mf-btn-sm" id="cnt-open-csv"><i data-lucide="upload"></i> CSV Import</button>
              <button type="button" class="mf-btn mf-btn-primary mf-btn-sm" id="cnt-open-add"><i data-lucide="user-plus"></i> Add Contact</button>
            </div>
          </div>

          <div class="mf-table-wrap">
            <table class="mf-table">
              <thead>
                <tr><th>Subscriber</th><th>Audience Group</th><th>Tags</th><th>Status</th><th>Location</th><th>Actions</th></tr>
              </thead>
              <tbody>
                ${filtered.length ? filtered.map((c) => `
                  <tr>
                    <td>
                      <strong>${c.name}</strong>
                      <div class="small" style="color:var(--mf-text-muted);">${c.email} · ${c.company}</div>
                    </td>
                    <td class="small">${c.group}</td>
                    <td>${(c.tags || []).map((t) => `<span class="mf-badge mf-badge-primary me-1">${t}</span>`).join('')}</td>
                    <td><span class="mf-badge mf-badge-${c.status === 'Active' ? 'success' : (c.status === 'New' ? 'info' : 'warning')}">${c.status}</span></td>
                    <td class="small">${c.location}</td>
                    <td>
                      <div class="d-flex gap-1">
                        <button type="button" class="mf-icon-btn" style="width:32px;height:32px;" data-cnt-edit="${c.id}" title="Edit"><i data-lucide="pencil" style="width:14px;height:14px;"></i></button>
                        <button type="button" class="mf-icon-btn" style="width:32px;height:32px;color:var(--mf-danger);" data-cnt-del="${c.id}" title="Delete"><i data-lucide="trash-2" style="width:14px;height:14px;"></i></button>
                      </div>
                    </td>
                  </tr>
                `).join('') : '<tr><td colspan="6" class="text-center py-4">No contacts match your filters.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;

      document.getElementById('cnt-search').addEventListener('input', (e) => { search = e.target.value.trim().toLowerCase(); draw(); if (window.lucide) window.lucide.createIcons(); });
      document.getElementById('cnt-status').addEventListener('change', (e) => { statusFilter = e.target.value; draw(); if (window.lucide) window.lucide.createIcons(); });
      document.getElementById('cnt-group').addEventListener('change', (e) => { groupFilter = e.target.value; draw(); if (window.lucide) window.lucide.createIcons(); });

      document.getElementById('cnt-open-add').addEventListener('click', () => openContactModal(null));
      document.getElementById('cnt-open-csv').addEventListener('click', openCsvModal);

      container.querySelectorAll('[data-cnt-edit]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = contacts.find((c) => c.id === btn.getAttribute('data-cnt-edit'));
          openContactModal(item);
        });
      });

      container.querySelectorAll('[data-cnt-del]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-cnt-del');
          window.MailFlowStore.setState((prev) => ({
            ...prev,
            contacts: prev.contacts.filter((c) => c.id !== id)
          }));
          window.MailFlowAppearance.toast('Contact removed from demo directory.', 'info');
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });
    }

    function openContactModal(existing) {
      window.MailFlowDash.openModal(`
        <div class="modal-header">
          <h5 class="modal-title">${existing ? 'Edit Contact' : 'Add New Contact'}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form id="mf-contact-modal-form" class="modal-body d-flex flex-column gap-3">
          <div class="row g-3">
            <div class="col-md-6"><label class="mf-label">Full Name</label><input type="text" class="mf-input" id="m-cnt-name" value="${existing ? existing.name : ''}" required></div>
            <div class="col-md-6"><label class="mf-label">Email Address</label><input type="email" class="mf-input" id="m-cnt-email" value="${existing ? existing.email : ''}" required></div>
          </div>
          <div class="row g-3">
            <div class="col-md-6"><label class="mf-label">Company</label><input type="text" class="mf-input" id="m-cnt-comp" value="${existing ? existing.company : ''}"></div>
            <div class="col-md-6"><label class="mf-label">Location</label><input type="text" class="mf-input" id="m-cnt-loc" value="${existing ? existing.location : 'London, UK'}"></div>
          </div>
          <div class="row g-3">
            <div class="col-md-4"><label class="mf-label">Status</label>
              <select class="mf-select" id="m-cnt-status">
                <option value="Active" ${existing && existing.status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="New" ${existing && existing.status === 'New' ? 'selected' : ''}>New</option>
                <option value="Unsubscribed" ${existing && existing.status === 'Unsubscribed' ? 'selected' : ''}>Unsubscribed</option>
              </select>
            </div>
            <div class="col-md-4"><label class="mf-label">Audience Group</label><input type="text" class="mf-input" id="m-cnt-group" value="${existing ? existing.group : 'Newsletter Subscribers'}"></div>
            <div class="col-md-4"><label class="mf-label">Tags (comma separated)</label><input type="text" class="mf-input" id="m-cnt-tags" value="${existing ? (existing.tags || []).join(', ') : 'VIP, SaaS'}"></div>
          </div>
          <div class="d-flex justify-content-end gap-2 pt-2">
            <button type="button" class="mf-btn mf-btn-ghost mf-btn-sm" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="mf-btn mf-btn-primary mf-btn-sm">Save Contact</button>
          </div>
        </form>
      `);

      document.getElementById('mf-contact-modal-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const item = {
          id: existing ? existing.id : 'cnt-' + Date.now(),
          name: document.getElementById('m-cnt-name').value.trim(),
          email: document.getElementById('m-cnt-email').value.trim(),
          company: document.getElementById('m-cnt-comp').value.trim() || 'Independent',
          location: document.getElementById('m-cnt-loc').value.trim() || 'Remote',
          status: document.getElementById('m-cnt-status').value,
          engagement: existing ? existing.engagement : 'High',
          activity: existing ? existing.activity : 'Signed up today',
          group: document.getElementById('m-cnt-group').value.trim() || 'Newsletter Subscribers',
          tags: document.getElementById('m-cnt-tags').value.split(',').map((t) => t.trim()).filter(Boolean),
          joined: existing ? existing.joined : new Date().toISOString().slice(0, 10)
        };
        if (!item.name || !item.email) return;
        window.MailFlowAjax.post('contacts/save', item).then(() => {
          window.MailFlowStore.setState((prev) => {
            const exists = prev.contacts.some((c) => c.id === item.id);
            const updated = exists ? prev.contacts.map((c) => (c.id === item.id ? item : c)) : [item, ...prev.contacts];
            return { ...prev, contacts: updated };
          });
          window.MailFlowDash.closeModal();
          window.MailFlowAppearance.toast(`Contact ${item.name} saved.`, 'success');
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });
    }

    function openCsvModal() {
      window.MailFlowDash.openModal(`
        <div class="modal-header">
          <h5 class="modal-title">CSV Contact Import (Demo Parser)</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body d-flex flex-column gap-3">
          <p class="small mb-0">Upload a <code>.csv</code> file or paste rows as <code>Name, Email, Company, Group</code>:</p>
          <input type="file" class="mf-input" id="m-csv-file" accept=".csv">
          <textarea class="mf-textarea" id="m-csv-text" rows="5">Lina Karimi, lina@oasiscloud.ae, Oasis Cloud, VIP Customers
Owen Mercer, owen@brightstack.io, BrightStack, Trial Leads</textarea>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="mf-btn mf-btn-ghost mf-btn-sm" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="mf-btn mf-btn-primary mf-btn-sm" id="m-csv-import-btn">Import Contacts</button>
          </div>
        </div>
      `);

      document.getElementById('m-csv-file').addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => { document.getElementById('m-csv-text').value = reader.result; };
        reader.readAsText(file);
      });

      document.getElementById('m-csv-import-btn').addEventListener('click', () => {
        const raw = document.getElementById('m-csv-text').value || '';
        const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        const imported = [];
        lines.forEach((line, idx) => {
          const parts = line.split(',').map((p) => p.trim());
          if (parts.length >= 2 && /@/.test(parts[1])) {
            imported.push({
              id: 'cnt-csv-' + Date.now() + '-' + idx,
              name: parts[0],
              email: parts[1],
              company: parts[2] || 'Imported Co.',
              location: 'Global',
              status: 'New',
              engagement: 'High',
              activity: 'Signed up today',
              group: parts[3] || 'Newsletter Subscribers',
              tags: ['CSV-Import'],
              joined: new Date().toISOString().slice(0, 10)
            });
          }
        });
        if (!imported.length) {
          window.MailFlowAppearance.toast('No valid CSV email rows detected.', 'error');
          return;
        }
        window.MailFlowAjax.post('contacts/import', { count: imported.length }).then(() => {
          window.MailFlowStore.setState((prev) => ({ ...prev, contacts: [...imported, ...prev.contacts] }));
          window.MailFlowDash.closeModal();
          window.MailFlowAppearance.toast(`Imported ${imported.length} contacts from CSV.`, 'success');
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });
    }

    draw();
  }

  function renderSegments(container) {
    let editingId = null;

    function draw() {
      const state = window.MailFlowStore.getState();
      const segments = state.segments || [];
      const active = editingId ? segments.find((s) => s.id === editingId) : null;

      container.innerHTML = `
        <div class="row g-4">
          <div class="col-lg-5">
            <div class="mf-card" style="height:auto;">
              <h2 class="h5 mb-3">${active ? 'Edit Segment' : 'Create Audience Segment'}</h2>
              <form id="mf-segment-form" class="d-flex flex-column gap-3">
                <div>
                  <label class="mf-label" for="seg-name">Segment Name</label>
                  <input type="text" class="mf-input" id="seg-name" value="${active ? active.name : ''}" placeholder="e.g. High Engagement Trial Users" required>
                </div>
                <div>
                  <label class="mf-label" for="seg-activity">Subscriber Activity Filter</label>
                  <select class="mf-select" id="seg-activity">
                    <option value="All">Any Activity</option>
                    <option value="Opened 5/5" ${active && active.activity === 'Opened 5/5' ? 'selected' : ''}>Opened 5/5 / Clicked CTA</option>
                    <option value="Signed up recently" ${active && active.activity === 'Signed up recently' ? 'selected' : ''}>Signed up recently</option>
                    <option value="No open 30d+" ${active && active.activity === 'No open 30d+' ? 'selected' : ''}>No open 30d+</option>
                  </select>
                </div>
                <div class="row g-2">
                  <div class="col-sm-6">
                    <label class="mf-label" for="seg-location">Location Filter</label>
                    <select class="mf-select" id="seg-location">
                      <option value="All Locations">All Locations</option>
                      <option value="US" ${active && active.location === 'US' ? 'selected' : ''}>United States</option>
                      <option value="UK" ${active && active.location === 'UK' ? 'selected' : ''}>United Kingdom</option>
                      <option value="UAE / SA" ${active && active.location === 'UAE / SA' ? 'selected' : ''}>UAE / Saudi Arabia</option>
                    </select>
                  </div>
                  <div class="col-sm-6">
                    <label class="mf-label" for="seg-engagement">Engagement Filter</label>
                    <select class="mf-select" id="seg-engagement">
                      <option value="All">All Engagement</option>
                      <option value="High" ${active && active.engagement === 'High' ? 'selected' : ''}>High</option>
                      <option value="Medium" ${active && active.engagement === 'Medium' ? 'selected' : ''}>Medium</option>
                      <option value="Low" ${active && active.engagement === 'Low' ? 'selected' : ''}>Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="mf-label" for="seg-desc">Description</label>
                  <input type="text" class="mf-input" id="seg-desc" value="${active ? active.description : ''}" placeholder="Target criteria notes...">
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="mf-btn mf-btn-primary mf-btn-sm">${active ? 'Update Segment' : 'Save Segment'}</button>
                  ${active ? '<button type="button" class="mf-btn mf-btn-ghost mf-btn-sm" id="seg-cancel">Cancel</button>' : ''}
                </div>
              </form>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="mf-card-grid mf-card-grid-2">
              ${segments.map((s) => {
                const count = window.MailFlowStore.computeSegmentCount(s);
                return `
                  <article class="mf-card">
                    <div class="mf-card-body">
                      <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h3 class="h6 mb-0">${s.name}</h3>
                        <span class="mf-badge mf-badge-primary">${count} contacts</span>
                      </div>
                      <p class="small mb-3">${s.description || 'Custom audience filter rule'}</p>
                      <div class="d-flex flex-wrap gap-1 mb-2">
                        <span class="mf-badge mf-badge-info">Activity: ${s.activity}</span>
                        <span class="mf-badge mf-badge-neutral">Loc: ${s.location}</span>
                        <span class="mf-badge mf-badge-success">Eng: ${s.engagement}</span>
                      </div>
                    </div>
                    <div class="mf-card-footer d-flex gap-2">
                      <button type="button" class="mf-btn mf-btn-secondary mf-btn-sm flex-grow-1" data-seg-edit="${s.id}">Edit</button>
                      <button type="button" class="mf-btn mf-btn-ghost mf-btn-sm" style="color:var(--mf-danger);" data-seg-del="${s.id}">Delete</button>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;

      document.getElementById('mf-segment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('seg-name').value.trim();
        if (!name) return;
        const seg = {
          id: editingId || 'seg-' + Date.now(),
          name,
          activity: document.getElementById('seg-activity').value,
          location: document.getElementById('seg-location').value,
          engagement: document.getElementById('seg-engagement').value,
          description: document.getElementById('seg-desc').value.trim()
        };
        window.MailFlowAjax.post('segments/save', seg).then(() => {
          window.MailFlowStore.setState((prev) => {
            const exists = prev.segments.some((s) => s.id === seg.id);
            const updated = exists ? prev.segments.map((s) => (s.id === seg.id ? seg : s)) : [seg, ...prev.segments];
            return { ...prev, segments: updated };
          });
          editingId = null;
          window.MailFlowAppearance.toast(`Segment "${name}" saved.`, 'success');
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });

      const cancel = document.getElementById('seg-cancel');
      if (cancel) cancel.addEventListener('click', () => { editingId = null; draw(); });

      container.querySelectorAll('[data-seg-edit]').forEach((btn) => {
        btn.addEventListener('click', () => { editingId = btn.getAttribute('data-seg-edit'); draw(); });
      });

      container.querySelectorAll('[data-seg-del]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-seg-del');
          window.MailFlowStore.setState((prev) => ({ ...prev, segments: prev.segments.filter((s) => s.id !== id) }));
          window.MailFlowAppearance.toast('Segment deleted.', 'info');
          draw();
        });
      });
    }

    draw();
  }

  window.MailFlowDash.registerView('contacts', renderContacts);
  window.MailFlowDash.registerView('segments', renderSegments);
})(window);

