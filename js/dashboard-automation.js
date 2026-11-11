/* ==========================================================================
   MailFlow Dashboard Pages 6 & 7 — Visual Automation & Templates
   ========================================================================== */

(function (window) {
  'use strict';

  function renderAutomation(container) {
    let selectedWfId = null;

    function draw() {
      const workflows = window.MailFlowStore.getState().workflows || [];
      if (!selectedWfId && workflows.length) selectedWfId = workflows[0].id;
      const wf = workflows.find((w) => w.id === selectedWfId) || workflows[0];

      container.innerHTML = `
        <div class="row g-4">
          <!-- Workflow List -->
          <div class="col-lg-4">
            <div class="mf-card" style="height:auto;">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h5 mb-0">Automation Flows</h2>
                <button type="button" class="mf-btn mf-btn-primary mf-btn-sm" id="wf-new-btn"><i data-lucide="plus"></i> New</button>
              </div>
              <div class="d-flex flex-column gap-2">
                ${workflows.map((w) => `
                  <button type="button" class="text-start p-3 rounded-3 border ${w.id === wf.id ? 'border-primary' : ''}" data-select-wf="${w.id}" style="background:${w.id === wf.id ? 'var(--mf-primary-soft)' : 'var(--mf-bg-elevated)'};border-color:${w.id === wf.id ? 'var(--mf-primary)' : 'var(--mf-border)'} !important;color:var(--mf-text);cursor:pointer;">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <strong class="small">${w.name}</strong>
                      <span class="mf-badge mf-badge-${w.status === 'Active' ? 'success' : 'warning'}">${w.status}</span>
                    </div>
                    <div class="small" style="color:var(--mf-text-muted);">${w.enrolled.toLocaleString()} enrolled · ${w.conversion} conv.</div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Visual Workflow Canvas -->
          <div class="col-lg-8">
            <div class="mf-card" style="height:auto;">
              <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                  <h2 class="h5 mb-1">${wf.name}</h2>
                  <p class="small mb-0">Trigger: ${wf.trigger}</p>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <button type="button" class="mf-btn mf-btn-secondary mf-btn-sm" id="wf-toggle-status">
                    ${wf.status === 'Active' ? 'Deactivate Flow' : 'Activate Flow'}
                  </button>
                  <button type="button" class="mf-btn mf-btn-primary mf-btn-sm" id="wf-save-btn"><i data-lucide="save"></i> Save Workflow</button>
                </div>
              </div>

              <!-- Connecting Workflow Lines & Nodes -->
              <div class="mf-flow-canvas mb-3">
                ${(wf.nodes || []).map((node, idx) => `
                  ${idx > 0 ? '<div class="mf-flow-connector" aria-hidden="true"></div>' : ''}
                  <div class="mf-flow-node-card">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="mf-badge mf-badge-${node.kind === 'trigger' ? 'primary' : (node.kind === 'condition' ? 'warning' : 'success')} text-uppercase">${node.kind}</span>
                      ${idx > 0 ? `<button type="button" class="btn btn-sm btn-link text-danger p-0 text-decoration-none" data-wf-del-node="${node.id}">Remove</button>` : ''}
                    </div>
                    <div class="fw-bold small">${node.title}</div>
                    <div class="small" style="color:var(--mf-text-muted);">${node.detail}</div>
                  </div>
                `).join('')}
                <div class="mf-flow-connector" aria-hidden="true"></div>
                <div class="d-flex flex-wrap justify-content-center gap-2 mt-1">
                  <button type="button" class="mf-btn mf-btn-secondary mf-btn-sm" data-wf-add="condition"><i data-lucide="git-branch"></i> + Condition Block</button>
                  <button type="button" class="mf-btn mf-btn-primary mf-btn-sm" data-wf-add="action"><i data-lucide="mail"></i> + Action Block</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      container.querySelectorAll('[data-select-wf]').forEach((btn) => {
        btn.addEventListener('click', () => {
          selectedWfId = btn.getAttribute('data-select-wf');
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });

      document.getElementById('wf-toggle-status').addEventListener('click', () => {
        const nextStatus = wf.status === 'Active' ? 'Paused' : 'Active';
        window.MailFlowStore.setState((prev) => ({
          ...prev,
          workflows: prev.workflows.map((w) => (w.id === wf.id ? { ...w, status: nextStatus } : w))
        }));
        window.MailFlowAppearance.toast(`Workflow "${wf.name}" is now ${nextStatus}.`, 'info');
        draw();
        if (window.lucide) window.lucide.createIcons();
      });

      document.getElementById('wf-save-btn').addEventListener('click', () => {
        window.MailFlowAjax.post('automation/save', wf).then(() => {
          window.MailFlowAppearance.toast(`Workflow "${wf.name}" saved to local workspace.`, 'success');
        });
      });

      container.querySelectorAll('[data-wf-add]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const kind = btn.getAttribute('data-wf-add');
          const newNode = kind === 'condition'
            ? { id: 'n-' + Date.now(), kind: 'condition', title: 'Wait 3 Days · Clicked Link?', detail: 'Evaluate subscriber link click event' }
            : { id: 'n-' + Date.now(), kind: 'action', title: 'Send Follow-Up Email', detail: 'Automated personalized follow-up touch' };
          window.MailFlowStore.setState((prev) => ({
            ...prev,
            workflows: prev.workflows.map((w) => (w.id === wf.id ? { ...w, nodes: [...w.nodes, newNode] } : w))
          }));
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });

      container.querySelectorAll('[data-wf-del-node]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nid = btn.getAttribute('data-wf-del-node');
          window.MailFlowStore.setState((prev) => ({
            ...prev,
            workflows: prev.workflows.map((w) => (w.id === wf.id ? { ...w, nodes: w.nodes.filter((n) => n.id !== nid) } : w))
          }));
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });

      document.getElementById('wf-new-btn').addEventListener('click', () => {
        const created = {
          id: 'wf-' + Date.now(),
          name: 'Custom Lifecycle Flow',
          trigger: 'Custom API Webhook Event',
          status: 'Active',
          enrolled: 120,
          conversion: '22.0%',
          nodes: [
            { id: 'n1', kind: 'trigger', title: 'Webhook Received', detail: 'Source: App Product Event' },
            { id: 'n2', kind: 'action', title: 'Send Targeted Onboarding Email', detail: 'Template: Warm Welcome' }
          ]
        };
        window.MailFlowStore.setState((prev) => ({ ...prev, workflows: [created, ...prev.workflows] }));
        selectedWfId = created.id;
        window.MailFlowAppearance.toast('Created new workflow template.', 'success');
        draw();
        if (window.lucide) window.lucide.createIcons();
      });
    }

    draw();
  }

  function renderTemplates(container) {
    let category = 'All';
    let search = '';
    const categories = ['All', 'Newsletter', 'Promotional', 'Welcome Email', 'Product Announcement', 'Event Invitation', 'Transactional'];

    function draw() {
      const templates = window.MailFlowStore.getState().templates || [];
      const filtered = templates.filter((t) => {
        if (category !== 'All' && t.category !== category) return false;
        if (search && !(t.name + ' ' + t.description + ' ' + t.category).toLowerCase().includes(search)) return false;
        return true;
      });

      container.innerHTML = `
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div class="d-flex flex-wrap gap-2">
            ${categories.map((cat) => `
              <button type="button" class="mf-btn ${cat === category ? 'mf-btn-primary' : 'mf-btn-secondary'} mf-btn-sm" data-tpl-cat="${cat}">${cat}</button>
            `).join('')}
          </div>
          <input type="search" class="mf-input" id="tpl-search" value="${search}" placeholder="Search templates..." style="width:220px;padding-block:0.45rem;">
        </div>

        <div class="mf-card-grid mf-card-grid-3">
          ${filtered.length ? filtered.map((t) => `
            <article class="mf-card mf-card-interactive">
              <div class="mf-card-img-wrap">
                <img src="${t.image}" alt="${t.name} template preview" loading="lazy">
              </div>
              <div class="mf-card-body">
                <span class="mf-badge mf-badge-primary mb-2" style="width:fit-content;">${t.category}</span>
                <h3 class="h5 mb-1">${t.name}</h3>
                <p class="small mb-0">${t.description}</p>
              </div>
              <div class="mf-card-footer d-flex gap-2">
                <button type="button" class="mf-btn mf-btn-secondary mf-btn-sm flex-grow-1" data-tpl-preview="${t.id}">Preview</button>
                <button type="button" class="mf-btn mf-btn-primary mf-btn-sm flex-grow-1" data-tpl-use="${t.id}">Use Template</button>
              </div>
            </article>
          `).join('') : '<div class="mf-card text-center py-5">No templates match your search criteria.</div>'}
        </div>
      `;

      container.querySelectorAll('[data-tpl-cat]').forEach((btn) => {
        btn.addEventListener('click', () => { category = btn.getAttribute('data-tpl-cat'); draw(); });
      });

      document.getElementById('tpl-search').addEventListener('input', (e) => {
        search = e.target.value.trim().toLowerCase();
        draw();
      });

      container.querySelectorAll('[data-tpl-preview]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const t = templates.find((item) => item.id === btn.getAttribute('data-tpl-preview'));
          if (!t) return;
          window.MailFlowDash.openModal(`
            <div class="modal-header">
              <h5 class="modal-title">${t.name} — ${t.category}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3 small"><strong>Subject:</strong> ${t.subject}</div>
              <div class="p-4 rounded-3" style="background:#FFFFFF;color:#211D35;border:1px solid var(--mf-border);">
                <img src="${t.image}" alt="${t.name}" style="width:100%;max-height:220px;object-fit:cover;border-radius:10px;margin-bottom:1rem;">
                <h4 style="color:#7C3AED;">${t.name}</h4>
                <p style="color:#4B4563;">${t.description}</p>
                <span class="mf-btn mf-btn-primary mf-btn-sm">Primary Email Action</span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="mf-btn mf-btn-ghost mf-btn-sm" data-bs-dismiss="modal">Close</button>
              <button type="button" class="mf-btn mf-btn-primary mf-btn-sm" id="modal-use-tpl-btn">Load in Email Builder</button>
            </div>
          `);
          document.getElementById('modal-use-tpl-btn').addEventListener('click', () => {
            useTemplate(t);
            window.MailFlowDash.closeModal();
          });
        });
      });

      container.querySelectorAll('[data-tpl-use]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const t = templates.find((item) => item.id === btn.getAttribute('data-tpl-use'));
          if (t) useTemplate(t);
        });
      });
    }

    function useTemplate(t) {
      const clonedBlocks = JSON.parse(JSON.stringify(t.blocks || [])).map((b, i) => ({ ...b, id: 'blk-' + Date.now() + '-' + i }));
      window.MailFlowStore.setState((prev) => ({
        ...prev,
        builderDraft: { templateName: t.name, subject: t.subject, blocks: clonedBlocks }
      }));
      window.MailFlowAppearance.toast(`Loaded "${t.name}" into Email Builder.`, 'success');
      window.MailFlowDash.navigate('builder');
    }

    draw();
  }

  window.MailFlowDash.registerView('automation', renderAutomation);
  window.MailFlowDash.registerView('templates', renderTemplates);
})(window);

