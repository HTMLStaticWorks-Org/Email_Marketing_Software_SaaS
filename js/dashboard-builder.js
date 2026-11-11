/* ==========================================================================
   MailFlow Dashboard Page 3 — Drag-and-Drop Email Builder
   ========================================================================== */

(function (window) {
  'use strict';

  const BLOCK_PRESETS = {
    heading: () => ({ id: 'blk-' + Date.now(), type: 'heading', text: 'Your Compelling Headline', align: 'center', color: '#8B5CF6' }),
    paragraph: () => ({ id: 'blk-' + Date.now(), type: 'paragraph', text: 'Write crisp, personalized copy that drives subscribers to take action.' }),
    image: () => ({ id: 'blk-' + Date.now(), type: 'image', src: 'assets/img/a%20(10).jpg', alt: 'Email and social campaign flatlay' }),
    button: () => ({ id: 'blk-' + Date.now(), type: 'button', label: 'Explore Feature', url: 'https://mailflow.app', bg: '#8B5CF6' }),
    divider: () => ({ id: 'blk-' + Date.now(), type: 'divider' }),
    social: () => ({ id: 'blk-' + Date.now(), type: 'social', networks: ['X', 'LinkedIn', 'YouTube'] }),
    imageText: () => ({
      id: 'blk-' + Date.now(),
      type: 'imageText',
      src: 'assets/img/a%20(22).jpg',
      heading: 'Smart Lifecycle Spotlight',
      text: 'Combine product photography with focused storytelling in a balanced two-column block.'
    })
  };

  function renderBlockHtml(b) {
    if (b.type === 'heading') {
      return `<h2 style="text-align:${b.align || 'center'};color:${b.color || '#7C3AED'};margin:0;font-size:1.45rem;font-weight:700;">${b.text}</h2>`;
    }
    if (b.type === 'paragraph') {
      return `<p style="margin:0;color:#4B4563;font-size:0.95rem;line-height:1.6;">${b.text}</p>`;
    }
    if (b.type === 'image') {
      return `<img src="${b.src}" alt="${b.alt || 'Email visual'}" style="width:100%;max-height:220px;object-fit:cover;border-radius:10px;">`;
    }
    if (b.type === 'button') {
      return `<div style="text-align:center;"><span style="display:inline-block;padding:0.7rem 1.5rem;border-radius:10px;background:${b.bg || '#7C3AED'};color:#FFFFFF;font-weight:600;font-size:0.92rem;">${b.label}</span></div>`;
    }
    if (b.type === 'divider') {
      return `<hr style="border:none;border-top:1px solid #E5E1F2;margin:0.5rem 0;">`;
    }
    if (b.type === 'social') {
      const nets = b.networks || ['X', 'LinkedIn', 'YouTube'];
      return `<div style="display:flex;justify-content:center;gap:0.6rem;flex-wrap:wrap;">${nets.map((n) => `<span style="padding:0.35rem 0.8rem;border-radius:999px;background:#F3EFFD;color:#6D28D9;font-size:0.78rem;font-weight:600;">${n}</span>`).join('')}</div>`;
    }
    if (b.type === 'imageText') {
      return `
        <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:0.9rem;align-items:center;">
          <img src="${b.src}" alt="Spotlight" style="width:100%;height:110px;object-fit:cover;border-radius:8px;">
          <div>
            <div style="font-weight:700;color:#211D35;margin-bottom:0.25rem;">${b.heading}</div>
            <div style="font-size:0.84rem;color:#4B4563;">${b.text}</div>
          </div>
        </div>
      `;
    }
    return '';
  }

  function renderBuilder(container) {
    let previewMode = 'desktop';
    let selectedBlockId = null;

    function getDraft() {
      return window.MailFlowStore.getState().builderDraft;
    }

    function saveDraft(nextDraft) {
      window.MailFlowStore.setState((prev) => ({ ...prev, builderDraft: nextDraft }));
    }

    function draw() {
      const state = window.MailFlowStore.getState();
      const draft = getDraft();
      const blocks = draft.blocks || [];
      if (!selectedBlockId && blocks.length) selectedBlockId = blocks[0].id;
      const activeBlock = blocks.find((b) => b.id === selectedBlockId) || null;

      container.innerHTML = `
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div class="d-flex flex-wrap align-items-center gap-2">
            <input type="text" class="mf-input" id="bld-tpl-name" value="${draft.templateName || 'Untitled Template'}" style="width:220px;padding-block:0.45rem;" aria-label="Template Name">
            <select class="mf-select" id="bld-load-tpl" style="width:210px;padding-block:0.45rem;" aria-label="Load Email Template">
              <option value="">Load Email Template...</option>
              ${(state.templates || []).map((t) => `<option value="${t.id}">${t.name} (${t.category})</option>`).join('')}
            </select>
          </div>
          <div class="d-flex flex-wrap align-items-center gap-2">
            <div class="btn-group" role="group" aria-label="Preview Width">
              <button type="button" class="mf-btn ${previewMode === 'desktop' ? 'mf-btn-primary' : 'mf-btn-secondary'} mf-btn-sm" id="bld-mode-desktop"><i data-lucide="monitor"></i> Desktop</button>
              <button type="button" class="mf-btn ${previewMode === 'mobile' ? 'mf-btn-primary' : 'mf-btn-secondary'} mf-btn-sm" id="bld-mode-mobile"><i data-lucide="smartphone"></i> Mobile</button>
            </div>
            <button type="button" class="mf-btn mf-btn-primary mf-btn-sm" id="bld-save-template"><i data-lucide="save"></i> Save Template</button>
          </div>
        </div>

        <div class="mf-builder-workspace">
          <!-- 1. Component Sidebar -->
          <aside class="mf-card p-3" style="height:auto;">
            <h2 class="h6 mb-1">Email Blocks</h2>
            <p class="small mb-3">Drag onto canvas or click to add</p>
            <div class="d-flex flex-column gap-2">
              <button type="button" class="mf-builder-block-btn" draggable="true" data-add-block="heading"><i data-lucide="heading" style="width:16px;height:16px;"></i> Heading Block</button>
              <button type="button" class="mf-builder-block-btn" draggable="true" data-add-block="paragraph"><i data-lucide="align-left" style="width:16px;height:16px;"></i> Paragraph Block</button>
              <button type="button" class="mf-builder-block-btn" draggable="true" data-add-block="image"><i data-lucide="image" style="width:16px;height:16px;"></i> Image Block</button>
              <button type="button" class="mf-builder-block-btn" draggable="true" data-add-block="button"><i data-lucide="mouse-pointer-click" style="width:16px;height:16px;"></i> Button Block</button>
              <button type="button" class="mf-builder-block-btn" draggable="true" data-add-block="divider"><i data-lucide="minus" style="width:16px;height:16px;"></i> Divider Block</button>
              <button type="button" class="mf-builder-block-btn" draggable="true" data-add-block="social"><i data-lucide="share-2" style="width:16px;height:16px;"></i> Social Links Block</button>
              <button type="button" class="mf-builder-block-btn" draggable="true" data-add-block="imageText"><i data-lucide="columns-2" style="width:16px;height:16px;"></i> Image &amp; Text Layout</button>
            </div>
          </aside>

          <!-- 2. Editing Canvas + Live Email Preview -->
          <section class="mf-card p-3 p-md-4" style="height:auto;">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="small fw-semibold" style="color:var(--mf-text-muted);">Live Email Preview (${previewMode === 'mobile' ? '340px Mobile' : '640px Desktop'})</span>
              <span class="mf-badge mf-badge-info">${blocks.length} blocks</span>
            </div>

            <div class="mf-email-canvas-frame ${previewMode === 'mobile' ? 'is-mobile-preview' : ''}" id="bld-drop-canvas">
              ${blocks.length ? blocks.map((b, idx) => `
                <div class="mf-canvas-block ${b.id === selectedBlockId ? 'is-selected' : ''}" data-select-block="${b.id}">
                  <div class="mf-canvas-block-actions">
                    <button type="button" class="btn btn-sm btn-light border py-0 px-1" data-move-up="${idx}" title="Move Up">&uarr;</button>
                    <button type="button" class="btn btn-sm btn-light border py-0 px-1" data-move-down="${idx}" title="Move Down">&darr;</button>
                    <button type="button" class="btn btn-sm btn-danger py-0 px-1" data-del-block="${b.id}" title="Delete">&times;</button>
                  </div>
                  ${renderBlockHtml(b)}
                </div>
              `).join('') : '<div class="text-center py-5 text-muted">Canvas is empty. Click any block on the left to begin.</div>'}
            </div>
          </section>

          <!-- 3. Settings Panel -->
          <aside class="mf-card p-3 mf-builder-settings-pane" style="height:auto;">
            <h2 class="h6 mb-3">Block Settings</h2>
            ${activeBlock ? renderSettingsForm(activeBlock) : '<p class="small mb-0">Select a block on the canvas to edit its properties.</p>'}
          </aside>
        </div>
      `;

      // Bind add / drag-drop
      container.querySelectorAll('[data-add-block]').forEach((btn) => {
        const type = btn.getAttribute('data-add-block');
        btn.addEventListener('click', () => addBlock(type));
        btn.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', type);
        });
      });

      const dropZone = document.getElementById('bld-drop-canvas');
      if (dropZone) {
        dropZone.addEventListener('dragover', (e) => e.preventDefault());
        dropZone.addEventListener('drop', (e) => {
          e.preventDefault();
          const type = e.dataTransfer.getData('text/plain');
          if (BLOCK_PRESETS[type]) addBlock(type);
        });
      }

      function addBlock(type) {
        const nextBlock = BLOCK_PRESETS[type]();
        const d = getDraft();
        const updated = { ...d, blocks: [...(d.blocks || []), nextBlock] };
        selectedBlockId = nextBlock.id;
        saveDraft(updated);
        draw();
        if (window.lucide) window.lucide.createIcons();
      }

      // Select, reorder, delete
      container.querySelectorAll('[data-select-block]').forEach((el) => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('button')) return;
          selectedBlockId = el.getAttribute('data-select-block');
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });

      container.querySelectorAll('[data-move-up]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.getAttribute('data-move-up'), 10);
          if (i <= 0) return;
          const d = getDraft();
          const arr = [...d.blocks];
          [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
          saveDraft({ ...d, blocks: arr });
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });

      container.querySelectorAll('[data-move-down]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const i = parseInt(btn.getAttribute('data-move-down'), 10);
          const d = getDraft();
          const arr = [...d.blocks];
          if (i >= arr.length - 1) return;
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          saveDraft({ ...d, blocks: arr });
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });

      container.querySelectorAll('[data-del-block]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-del-block');
          const d = getDraft();
          const arr = d.blocks.filter((b) => b.id !== id);
          if (selectedBlockId === id) selectedBlockId = arr[0] ? arr[0].id : null;
          saveDraft({ ...d, blocks: arr });
          draw();
          if (window.lucide) window.lucide.createIcons();
        });
      });

      // Preview mode toggle
      document.getElementById('bld-mode-desktop').addEventListener('click', () => { previewMode = 'desktop'; draw(); if (window.lucide) window.lucide.createIcons(); });
      document.getElementById('bld-mode-mobile').addEventListener('click', () => { previewMode = 'mobile'; draw(); if (window.lucide) window.lucide.createIcons(); });

      // Load template dropdown
      document.getElementById('bld-load-tpl').addEventListener('change', (e) => {
        const tplId = e.target.value;
        if (!tplId) return;
        const tpl = state.templates.find((t) => t.id === tplId);
        if (!tpl) return;
        const clonedBlocks = JSON.parse(JSON.stringify(tpl.blocks)).map((b, i) => ({ ...b, id: 'blk-' + Date.now() + '-' + i }));
        selectedBlockId = clonedBlocks[0] ? clonedBlocks[0].id : null;
        saveDraft({ templateName: tpl.name, subject: tpl.subject, blocks: clonedBlocks });
        window.MailFlowAppearance.toast(`Loaded "${tpl.name}" into Email Builder.`, 'info');
        draw();
        if (window.lucide) window.lucide.createIcons();
      });

      // Template name change
      document.getElementById('bld-tpl-name').addEventListener('input', (e) => {
        const d = getDraft();
        saveDraft({ ...d, templateName: e.target.value });
      });

      // Save template
      document.getElementById('bld-save-template').addEventListener('click', () => {
        const d = getDraft();
        const name = (document.getElementById('bld-tpl-name').value || '').trim() || 'Custom Email Design';
        const newTpl = {
          id: 'tpl-' + Date.now(),
          name,
          category: 'Newsletter',
          description: 'Custom layout created inside MailFlow Email Builder.',
          subject: d.subject || name,
          image: 'assets/img/a%20(17).jpg',
          blocks: JSON.parse(JSON.stringify(d.blocks || []))
        };
        window.MailFlowAjax.post('builder/save-template', newTpl).then(() => {
          window.MailFlowStore.setState((prev) => ({
            ...prev,
            templates: [newTpl, ...prev.templates]
          }));
          window.MailFlowAppearance.toast(`Saved "${name}" to Templates library!`, 'success');
        });
      });

      // Settings live bindings
      container.querySelectorAll('[data-block-prop]').forEach((input) => {
        input.addEventListener('input', () => {
          const prop = input.getAttribute('data-block-prop');
          const d = getDraft();
          const updatedBlocks = d.blocks.map((b) => {
            if (b.id !== selectedBlockId) return b;
            return { ...b, [prop]: input.value };
          });
          saveDraft({ ...d, blocks: updatedBlocks });
          // Refresh just the preview HTML for snappy typing
          const selEl = container.querySelector(`[data-select-block="${selectedBlockId}"]`);
          const updatedBlock = updatedBlocks.find((b) => b.id === selectedBlockId);
          if (selEl && updatedBlock) {
            const actionsHtml = selEl.querySelector('.mf-canvas-block-actions').outerHTML;
            selEl.innerHTML = actionsHtml + renderBlockHtml(updatedBlock);
          }
        });
      });
    }

    function renderSettingsForm(b) {
      if (b.type === 'heading') {
        return `
          <div class="d-flex flex-column gap-3">
            <div><label class="mf-label">Heading Text</label><input type="text" class="mf-input" data-block-prop="text" value="${b.text}"></div>
            <div><label class="mf-label">Alignment</label>
              <select class="mf-select" data-block-prop="align">
                <option value="left" ${b.align === 'left' ? 'selected' : ''}>Left</option>
                <option value="center" ${b.align === 'center' ? 'selected' : ''}>Center</option>
                <option value="right" ${b.align === 'right' ? 'selected' : ''}>Right</option>
              </select>
            </div>
            <div><label class="mf-label">Accent Color</label><input type="color" class="form-control form-control-color" data-block-prop="color" value="${b.color || '#8B5CF6'}"></div>
          </div>
        `;
      }
      if (b.type === 'paragraph') {
        return `<div><label class="mf-label">Paragraph Copy</label><textarea class="mf-textarea" rows="5" data-block-prop="text">${b.text}</textarea></div>`;
      }
      if (b.type === 'image') {
        return `
          <div class="d-flex flex-column gap-3">
            <div><label class="mf-label">Image URL</label><input type="url" class="mf-input" data-block-prop="src" value="${b.src}"></div>
            <div><label class="mf-label">Alt Description</label><input type="text" class="mf-input" data-block-prop="alt" value="${b.alt || ''}"></div>
          </div>
        `;
      }
      if (b.type === 'button') {
        return `
          <div class="d-flex flex-column gap-3">
            <div><label class="mf-label">Button Label</label><input type="text" class="mf-input" data-block-prop="label" value="${b.label}"></div>
            <div><label class="mf-label">Destination URL</label><input type="url" class="mf-input" data-block-prop="url" value="${b.url}"></div>
            <div><label class="mf-label">Button Color</label><input type="color" class="form-control form-control-color" data-block-prop="bg" value="${b.bg || '#8B5CF6'}"></div>
          </div>
        `;
      }
      if (b.type === 'imageText') {
        return `
          <div class="d-flex flex-column gap-3">
            <div><label class="mf-label">Section Heading</label><input type="text" class="mf-input" data-block-prop="heading" value="${b.heading}"></div>
            <div><label class="mf-label">Copy</label><textarea class="mf-textarea" rows="3" data-block-prop="text">${b.text}</textarea></div>
            <div><label class="mf-label">Image URL</label><input type="url" class="mf-input" data-block-prop="src" value="${b.src}"></div>
          </div>
        `;
      }
      return `<p class="small mb-0">This ${b.type} block uses automatic responsive spacing.</p>`;
    }

    draw();
  }

  window.MailFlowDash.registerView('builder', renderBuilder);
})(window);

