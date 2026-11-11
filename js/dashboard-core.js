/* ==========================================================================
   MailFlow Dashboard Core Router, Drawer, Modal & Chart Registry
   ========================================================================== */

(function (window, document) {
  'use strict';

  const ROUTES = {
    overview: { titleKey: 'dash.overview', label: 'Overview' },
    campaigns: { titleKey: 'dash.campaigns', label: 'Campaigns' },
    builder: { titleKey: 'dash.builder', label: 'Email Builder' },
    contacts: { titleKey: 'dash.contacts', label: 'Contacts' },
    segments: { titleKey: 'dash.segments', label: 'Segments' },
    automation: { titleKey: 'dash.automation', label: 'Automation' },
    templates: { titleKey: 'dash.templates', label: 'Templates' },
    analytics: { titleKey: 'dash.analytics', label: 'Analytics' },
    integrations: { titleKey: 'dash.integrations', label: 'Integrations' },
    settings: { titleKey: 'dash.settings', label: 'Settings' }
  };

  const viewHandlers = {};
  const chartInstances = [];
  let activeRoute = 'overview';

  function destroyCharts() {
    while (chartInstances.length) {
      const c = chartInstances.pop();
      try { c.destroy(); } catch (e) {}
    }
  }

  function registerChart(chart) {
    if (chart) chartInstances.push(chart);
    return chart;
  }

  function getChartColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      isLight,
      text: isLight ? '#6B6680' : '#A6A1B5',
      grid: isLight ? 'rgba(33,29,53,0.08)' : 'rgba(196,181,253,0.12)',
      primary: isLight ? '#7C3AED' : '#8B5CF6',
      secondary: isLight ? '#A78BFA' : '#C4B5FD',
      success: '#10B981',
      warning: '#F59E0B',
      info: '#38BDF8'
    };
  }

  function closeDrawer() {
    const sb = document.getElementById('mf-dash-sidebar');
    const bd = document.getElementById('mf-dash-backdrop');
    if (sb) sb.classList.remove('is-open');
    if (bd) bd.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function openDrawer() {
    const sb = document.getElementById('mf-dash-sidebar');
    const bd = document.getElementById('mf-dash-backdrop');
    if (sb) sb.classList.add('is-open');
    if (bd) bd.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function navigate(route) {
    const clean = ROUTES[route] ? route : 'overview';
    activeRoute = clean;
    if (window.location.hash !== '#' + clean) {
      window.location.hash = '#' + clean;
    }

    document.querySelectorAll('[data-dash-route]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-dash-route') === clean);
    });

    const meta = ROUTES[clean];
    const titleText = window.MailFlowI18n ? window.MailFlowI18n.t(meta.titleKey, meta.label) : meta.label;
    const titleEl = document.getElementById('mf-dash-title');
    const crumbEl = document.getElementById('mf-dash-breadcrumb');
    if (titleEl) titleEl.textContent = titleText;
    if (crumbEl) crumbEl.textContent = `MailFlow / ${titleText}`;

    const container = document.getElementById('mf-dash-view-container');
    destroyCharts();
    if (container && typeof viewHandlers[clean] === 'function') {
      viewHandlers[clean](container);
    }

    if (window.lucide) window.lucide.createIcons();
    closeDrawer();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function openModal(html) {
    const modalEl = document.getElementById('mfDashModal');
    const contentEl = document.getElementById('mfDashModalContent');
    if (!modalEl || !contentEl || !window.bootstrap) return null;
    contentEl.innerHTML = html;
    if (window.lucide) window.lucide.createIcons({ root: contentEl });
    const inst = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    inst.show();
    return inst;
  }

  function closeModal() {
    const modalEl = document.getElementById('mfDashModal');
    if (!modalEl || !window.bootstrap) return;
    const inst = window.bootstrap.Modal.getInstance(modalEl);
    if (inst) inst.hide();
  }

  function handleLogout() {
    window.MailFlowAjax.post('auth/logout', {}).then(() => {
      window.MailFlowStore.setState((prev) => ({
        ...prev,
        session: { ...prev.session, loggedIn: false }
      }));
      window.MailFlowAppearance.toast('Signed out of MailFlow Demo Workspace.', 'info');
      setTimeout(() => { window.location.href = 'login.html'; }, 550);
    });
  }

  function syncTopbarUser() {
    const state = window.MailFlowStore.getState();
    const user = state.session && state.session.user ? state.session.user : {};
    const nameEl = document.getElementById('mf-topbar-username');
    const avEl = document.getElementById('mf-topbar-avatar');
    if (nameEl && user.name) nameEl.textContent = user.name;
    if (avEl && user.avatar) avEl.src = user.avatar;
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncTopbarUser();

    document.querySelectorAll('[data-dash-route]').forEach((btn) => {
      btn.addEventListener('click', () => navigate(btn.getAttribute('data-dash-route')));
    });

    const openBtn = document.getElementById('mf-open-dash-drawer');
    const closeBtn = document.getElementById('mf-close-dash-drawer');
    const backdrop = document.getElementById('mf-dash-backdrop');
    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    const logoutSide = document.getElementById('mf-sidebar-logout');
    const logoutTop = document.getElementById('mf-topbar-logout');
    if (logoutSide) logoutSide.addEventListener('click', handleLogout);
    if (logoutTop) logoutTop.addEventListener('click', handleLogout);

    // Global Search quick jump
    const searchInput = document.getElementById('mf-dash-global-search');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = (searchInput.value || '').trim().toLowerCase();
          if (!q) return;
          if (/contact|subscriber|csv/.test(q)) navigate('contacts');
          else if (/segment|filter/.test(q)) navigate('segments');
          else if (/auto|flow|welcome|cart/.test(q)) navigate('automation');
          else if (/template|newsletter/.test(q)) navigate('templates');
          else if (/build|editor|block/.test(q)) navigate('builder');
          else if (/analytic|chart|bounce/.test(q)) navigate('analytics');
          else if (/integrat|shopify|stripe/.test(q)) navigate('integrations');
          else if (/setting|profile|sender/.test(q)) navigate('settings');
          else navigate('campaigns');
          window.MailFlowAppearance.toast(`Navigated to view matching "${q}".`, 'info');
        }
      });
    }

    window.addEventListener('hashchange', () => {
      const hashRoute = window.location.hash.replace('#', '').toLowerCase();
      if (ROUTES[hashRoute] && hashRoute !== activeRoute) {
        navigate(hashRoute);
      }
    });

    window.addEventListener('mailflow:appearance', () => {
      syncTopbarUser();
      // Re-render current view so Chart.js and localized labels refresh cleanly
      const container = document.getElementById('mf-dash-view-container');
      destroyCharts();
      if (container && typeof viewHandlers[activeRoute] === 'function') {
        viewHandlers[activeRoute](container);
        if (window.lucide) window.lucide.createIcons();
      }
      const meta = ROUTES[activeRoute];
      const titleText = window.MailFlowI18n ? window.MailFlowI18n.t(meta.titleKey, meta.label) : meta.label;
      const titleEl = document.getElementById('mf-dash-title');
      const crumbEl = document.getElementById('mf-dash-breadcrumb');
      if (titleEl) titleEl.textContent = titleText;
      if (crumbEl) crumbEl.textContent = `MailFlow / ${titleText}`;
    });

    const initial = window.location.hash.replace('#', '').toLowerCase() || 'overview';
    navigate(initial);
  });

  window.MailFlowDash = {
    registerView(name, fn) { viewHandlers[name] = fn; },
    navigate,
    openModal,
    closeModal,
    registerChart,
    getChartColors,
    handleLogout,
    refreshTopbar: syncTopbarUser
  };
})(window, document);

