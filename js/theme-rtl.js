/* ==========================================================================
   MailFlow Theme (Dark/Light) & Direction (LTR/RTL) Switcher
   ========================================================================== */

(function (window, document) {
  'use strict';

  function applyThemeAndDirection() {
    const state = window.MailFlowStore.getState();
    const theme = state.theme === 'light' ? 'light' : 'dark';
    const dir = state.dir === 'rtl' ? 'rtl' : 'ltr';
    const lang = dir === 'rtl' ? 'ar' : 'en';

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);

    // Update all theme toggle buttons (desktop, mobile drawer, dashboard, auth)
    document.querySelectorAll('[data-mf-theme-toggle]').forEach((btn) => {
      const nextLabel = theme === 'dark'
        ? window.MailFlowI18n.t('nav.themeToLight')
        : window.MailFlowI18n.t('nav.themeToDark');
      btn.setAttribute('aria-label', nextLabel);
      btn.setAttribute('title', nextLabel);
      const iconName = theme === 'dark' ? 'sun' : 'moon';
      const iconTarget = btn.querySelector('[data-mf-theme-icon]');
      if (iconTarget) {
        iconTarget.innerHTML = `<i data-lucide="${iconName}"></i>`;
      }
      const textTarget = btn.querySelector('[data-mf-theme-label]');
      if (textTarget) {
        textTarget.textContent = theme === 'dark' ? 'Light' : 'Dark';
      }
    });

    // Update all RTL/LTR toggle buttons
    document.querySelectorAll('[data-mf-dir-toggle]').forEach((btn) => {
      const nextLabel = dir === 'ltr'
        ? window.MailFlowI18n.t('nav.dirToRtl')
        : window.MailFlowI18n.t('nav.dirToLtr');
      btn.setAttribute('aria-label', nextLabel);
      btn.setAttribute('title', nextLabel);
      const labelEl = btn.querySelector('[data-mf-dir-label]');
      if (labelEl) {
        labelEl.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      }
    });

    if (window.MailFlowI18n) {
      window.MailFlowI18n.apply(document);
    }
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    window.dispatchEvent(new CustomEvent('mailflow:appearance', { detail: { theme, dir, lang } }));
  }

  function toggleTheme() {
    const state = window.MailFlowStore.getState();
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    window.MailFlowStore.setState({ theme: nextTheme });
    applyThemeAndDirection();
  }

  function toggleDirection() {
    const state = window.MailFlowStore.getState();
    const nextDir = state.dir === 'ltr' ? 'rtl' : 'ltr';
    const nextLang = nextDir === 'rtl' ? 'ar' : 'en';
    window.MailFlowStore.setState({ dir: nextDir, lang: nextLang });
    applyThemeAndDirection();
  }

  function setTheme(theme) {
    window.MailFlowStore.setState({ theme: theme === 'light' ? 'light' : 'dark' });
    applyThemeAndDirection();
  }

  function setDirection(dir) {
    const d = dir === 'rtl' ? 'rtl' : 'ltr';
    window.MailFlowStore.setState({ dir: d, lang: d === 'rtl' ? 'ar' : 'en' });
    applyThemeAndDirection();
  }

  // Toast Helper
  function showToast(message, type) {
    let region = document.getElementById('mf-toast-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'mf-toast-region';
      region.className = 'mf-toast-region';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    const toast = document.createElement('div');
    const variant = type === 'error' ? 'mf-toast-error' : (type === 'info' ? 'mf-toast-info' : 'mf-toast-success');
    const icon = type === 'error' ? 'alert-circle' : (type === 'info' ? 'info' : 'check-circle-2');
    toast.className = `mf-toast ${variant}`;
    toast.innerHTML = `<i data-lucide="${icon}" style="width:18px;height:18px;flex-shrink:0;margin-top:2px;"></i><div>${message}</div>`;
    region.appendChild(toast);
    if (window.lucide) window.lucide.createIcons({ root: toast });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      setTimeout(() => toast.remove(), 220);
    }, 3400);
  }

  // Delegate clicks for theme & dir buttons globally
  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('[data-mf-theme-toggle]');
    if (themeBtn) {
      e.preventDefault();
      toggleTheme();
      return;
    }
    const dirBtn = e.target.closest('[data-mf-dir-toggle]');
    if (dirBtn) {
      e.preventDefault();
      toggleDirection();
    }
  });

  // Apply immediately on parse if DOM is ready, and again on DOMContentLoaded
  if (document.readyState === 'loading') {
    const state = window.MailFlowStore.getState();
    document.documentElement.setAttribute('data-theme', state.theme === 'light' ? 'light' : 'dark');
    document.documentElement.setAttribute('dir', state.dir === 'rtl' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', state.dir === 'rtl' ? 'ar' : 'en');
    document.addEventListener('DOMContentLoaded', applyThemeAndDirection);
  } else {
    applyThemeAndDirection();
  }

  // Global Image Fallback Guard (prevents broken image icons if offline)
  const FALLBACK_SVG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#211D35"/><stop offset="100%" stop-color="#4C1D95"/></linearGradient></defs>' +
    '<rect width="800" height="500" fill="url(#g)"/>' +
    '<rect x="280" y="175" width="240" height="150" rx="14" fill="none" stroke="#C4B5FD" stroke-width="5"/>' +
    '<path d="M290 190 L400 265 L510 190" fill="none" stroke="#F8F7FC" stroke-width="5" stroke-linecap="round"/>' +
    '</svg>'
  );

  document.addEventListener('error', (e) => {
    const img = e.target;
    if (img && img.tagName === 'IMG' && !img.dataset.mfFallbackApplied) {
      img.dataset.mfFallbackApplied = '1';
      img.src = FALLBACK_SVG;
    }
  }, true);

  window.MailFlowAppearance = {
    apply: applyThemeAndDirection,
    toggleTheme,
    toggleDirection,
    setTheme,
    setDirection,
    toast: showToast
  };
})(window, document);

