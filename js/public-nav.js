/* ==========================================================================
   MailFlow Public Website Chrome (Navbar, Mobile Drawer, Footer, AOS & GSAP)
   ========================================================================== */

(function (window, document, $) {
  'use strict';

  function getActivePage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === '' || path === '/') return 'index.html';
    return path.toLowerCase();
  }

  function renderPublicNavbar() {
    const host = document.getElementById('mf-public-navbar-host');
    if (!host) return;
    const active = getActivePage();

    host.innerHTML = `
      <header class="mf-navbar">
        <div class="mf-container mf-navbar-inner">
          <a href="index.html" class="mf-brand" aria-label="MailFlow Home">
            <span class="mf-brand-mark" aria-hidden="true">
              <i data-lucide="send" style="width:18px;height:18px;"></i>
            </span>
            <span data-i18n="brand.name">MailFlow</span>
          </a>

          <nav aria-label="Primary Navigation">
            <ul class="mf-nav-links">
              <li><a href="index.html" class="mf-nav-link ${active === 'index.html' ? 'active' : ''}" data-i18n="nav.home">Home</a></li>
              <li><a href="home-2.html" class="mf-nav-link ${active === 'home-2.html' ? 'active' : ''}" data-i18n="nav.home2">Home 2</a></li>
              <li><a href="about.html" class="mf-nav-link ${active === 'about.html' ? 'active' : ''}" data-i18n="nav.about">About</a></li>
              <li><a href="services.html" class="mf-nav-link ${active === 'services.html' ? 'active' : ''}" data-i18n="nav.services">Services</a></li>
              <li><a href="features.html" class="mf-nav-link ${active === 'features.html' ? 'active' : ''}" data-i18n="nav.features">Features</a></li>
              <li><a href="pricing.html" class="mf-nav-link ${active === 'pricing.html' ? 'active' : ''}" data-i18n="nav.pricing">Pricing</a></li>
            </ul>
          </nav>

          <div class="mf-nav-actions">
            <button type="button" class="mf-icon-btn" data-mf-theme-toggle aria-label="Switch Theme" title="Switch Theme">
              <span data-mf-theme-icon><i data-lucide="sun"></i></span>
            </button>
            <button type="button" class="mf-icon-btn mf-dir-pill" data-mf-dir-toggle aria-label="Switch RTL/LTR" title="Switch Direction">
              <i data-lucide="languages" style="width:15px;height:15px;"></i>
              <span data-mf-dir-label>RTL</span>
            </button>
            <a href="login.html" class="mf-btn mf-btn-ghost mf-btn-sm" data-i18n="nav.login">Login</a>
            <a href="dashboard.html" class="mf-btn mf-btn-secondary mf-btn-sm">
              <i data-lucide="layout-dashboard" style="width:15px;height:15px;"></i>
              <span data-i18n="nav.dashboard">Dashboard</span>
            </a>
            <a href="register.html" class="mf-btn mf-btn-primary mf-btn-sm" data-i18n="nav.getStarted">Get Started</a>
          </div>

          <button type="button" class="mf-icon-btn mf-hamburger-btn" id="mf-open-mobile-menu" aria-label="Open Menu" aria-expanded="false" aria-controls="mf-mobile-drawer">
            <i data-lucide="menu"></i>
          </button>
        </div>
      </header>

      <div class="mf-mobile-drawer" id="mf-mobile-drawer" aria-hidden="true">
        <div class="mf-mobile-backdrop" id="mf-mobile-backdrop"></div>
        <div class="mf-mobile-panel" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div class="mf-mobile-header">
            <a href="index.html" class="mf-brand">
              <span class="mf-brand-mark" aria-hidden="true"><i data-lucide="send" style="width:17px;height:17px;"></i></span>
              <span data-i18n="brand.name">MailFlow</span>
            </a>
            <button type="button" class="mf-icon-btn" id="mf-close-mobile-menu" aria-label="Close Menu">
              <i data-lucide="x"></i>
            </button>
          </div>

          <div class="mf-mobile-nav-list">
            <a href="index.html" class="mf-mobile-nav-link ${active === 'index.html' ? 'active' : ''}">
              <span data-i18n="nav.home">Home</span>
              <i data-lucide="chevron-right" class="mf-rtl-flip" style="width:16px;height:16px;"></i>
            </a>
            <a href="home-2.html" class="mf-mobile-nav-link ${active === 'home-2.html' ? 'active' : ''}">
              <span data-i18n="nav.home2">Home 2</span>
              <i data-lucide="chevron-right" class="mf-rtl-flip" style="width:16px;height:16px;"></i>
            </a>
            <a href="about.html" class="mf-mobile-nav-link ${active === 'about.html' ? 'active' : ''}">
              <span data-i18n="nav.about">About</span>
              <i data-lucide="chevron-right" class="mf-rtl-flip" style="width:16px;height:16px;"></i>
            </a>
            <a href="services.html" class="mf-mobile-nav-link ${active === 'services.html' ? 'active' : ''}">
              <span data-i18n="nav.services">Services</span>
              <i data-lucide="chevron-right" class="mf-rtl-flip" style="width:16px;height:16px;"></i>
            </a>
            <a href="features.html" class="mf-mobile-nav-link ${active === 'features.html' ? 'active' : ''}">
              <span data-i18n="nav.features">Features</span>
              <i data-lucide="chevron-right" class="mf-rtl-flip" style="width:16px;height:16px;"></i>
            </a>
            <a href="pricing.html" class="mf-mobile-nav-link ${active === 'pricing.html' ? 'active' : ''}">
              <span data-i18n="nav.pricing">Pricing</span>
              <i data-lucide="chevron-right" class="mf-rtl-flip" style="width:16px;height:16px;"></i>
            </a>
          </div>

          <div class="mf-mobile-controls">
            <div class="mf-mobile-toggles">
              <button type="button" class="mf-mobile-toggle-btn" data-mf-theme-toggle>
                <span data-mf-theme-icon><i data-lucide="sun" style="width:16px;height:16px;"></i></span>
                <span data-mf-theme-label>Light</span>
              </button>
              <button type="button" class="mf-mobile-toggle-btn" data-mf-dir-toggle>
                <i data-lucide="languages" style="width:16px;height:16px;"></i>
                <span data-mf-dir-label>RTL</span>
              </button>
            </div>
            <a href="dashboard.html" class="mf-btn mf-btn-secondary w-100">
              <i data-lucide="layout-dashboard" style="width:16px;height:16px;"></i>
              <span data-i18n="nav.dashboard">Dashboard</span>
            </a>
            <a href="login.html" class="mf-btn mf-btn-ghost w-100" data-i18n="nav.login">Login</a>
            <a href="register.html" class="mf-btn mf-btn-primary w-100" data-i18n="nav.getStarted">Get Started</a>
          </div>
        </div>
      </div>
    `;

    const drawer = document.getElementById('mf-mobile-drawer');
    const openBtn = document.getElementById('mf-open-mobile-menu');
    const closeBtn = document.getElementById('mf-close-mobile-menu');
    const backdrop = document.getElementById('mf-mobile-backdrop');

    function setDrawer(open) {
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    openBtn.addEventListener('click', () => setDrawer(true));
    closeBtn.addEventListener('click', () => setDrawer(false));
    backdrop.addEventListener('click', () => setDrawer(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
    });
  }

  function renderPublicFooter() {
    const host = document.getElementById('mf-public-footer-host');
    if (!host) return;

    host.innerHTML = `
      <footer class="mf-footer">
        <div class="mf-container">
          <div class="mf-footer-grid">
            <div>
              <a href="index.html" class="mf-brand mb-3">
                <span class="mf-brand-mark" aria-hidden="true"><i data-lucide="send" style="width:18px;height:18px;"></i></span>
                <span data-i18n="brand.name">MailFlow</span>
              </a>
              <p class="small mb-3" style="max-width: 340px;" data-i18n="brand.tagline">Every Email. Smarter Connections.</p>
              <p class="small fw-semibold mb-2" style="color:var(--mf-text);" data-i18n="footer.newsletterTitle">Stay ahead in lifecycle marketing</p>
              <form id="mf-footer-newsletter-form" class="d-flex gap-2" style="max-width: 360px;" novalidate>
                <input type="email" class="mf-input" id="mf-footer-email" placeholder="you@company.com" aria-label="Email address" required>
                <button type="submit" class="mf-btn mf-btn-primary mf-btn-sm" data-i18n="footer.newsletterBtn">Subscribe</button>
              </form>
            </div>

            <div>
              <div class="mf-footer-title">Product</div>
              <ul class="mf-footer-links">
                <li><a href="index.html">Home 1 (SaaS Overview)</a></li>
                <li><a href="home-2.html">Home 2 (Lifecycle Studio)</a></li>
                <li><a href="features.html">Platform Features</a></li>
                <li><a href="services.html">Managed Services</a></li>
                <li><a href="about.html">About MailFlow</a></li>
                <li><a href="pricing.html">Plans &amp; Pricing</a></li>
              </ul>
            </div>

            <div>
              <div class="mf-footer-title">Workspace</div>
              <ul class="mf-footer-links">
                <li><a href="dashboard.html#overview">Marketer Dashboard</a></li>
                <li><a href="dashboard.html#campaigns">Campaign Manager</a></li>
                <li><a href="dashboard.html#templates">Email Templates</a></li>
                <li><a href="dashboard.html#integrations">Integrations Hub</a></li>
              </ul>
            </div>

            <div>
              <div class="mf-footer-title">Account</div>
              <ul class="mf-footer-links">
                <li><a href="login.html">Sign In</a></li>
                <li><a href="register.html">Create Free Account</a></li>
                <li><a href="pricing.html#faq">Billing FAQ</a></li>
                <li><a href="pricing.html#contact-sales">Contact Sales</a></li>
              </ul>
            </div>
          </div>

          <div class="mf-footer-bottom">
            <span data-i18n="footer.copyright">© 2026 MailFlow SaaS. Frontend interactive product showcase.</span>
            <span class="mf-demo-pill"><i data-lucide="shield-check" style="width:14px;height:14px;"></i> Demo Environment · LocalStorage Sync</span>
          </div>
        </div>
      </footer>
    `;

    const form = document.getElementById('mf-footer-newsletter-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('mf-footer-email');
        const val = (emailInput.value || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          window.MailFlowAppearance.toast('Please enter a valid work email address.', 'error');
          return;
        }
        window.MailFlowAjax.post('newsletter/subscribe', { email: val }).then(() => {
          emailInput.value = '';
          window.MailFlowAppearance.toast(`Demo subscription confirmed for ${val}.`, 'success');
        });
      });
    }
  }

  function initFaqAccordions() {
    document.querySelectorAll('.mf-faq-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.mf-faq-item');
        const isOpen = item.classList.contains('is-open');
        const group = item.parentElement;
        if (group) {
          group.querySelectorAll('.mf-faq-item.is-open').forEach((openItem) => {
            openItem.classList.remove('is-open');
            const t = openItem.querySelector('.mf-faq-trigger');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
        }
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function initAnimations() {
    if (window.AOS) {
      window.AOS.init({
        duration: 650,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
      });
    }

    if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const heroItems = document.querySelectorAll('.mf-gsap-hero');
      if (heroItems.length) {
        window.gsap.from(heroItems, {
          y: 24,
          opacity: 0,
          duration: 0.72,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity'
        });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderPublicNavbar();
    renderPublicFooter();
    initFaqAccordions();
    if (window.MailFlowAppearance) {
      window.MailFlowAppearance.apply();
    }
    initAnimations();
  });
})(window, document, window.jQuery);

