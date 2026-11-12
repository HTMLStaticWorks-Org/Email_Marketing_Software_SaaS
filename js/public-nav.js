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
              <li><a href="contact.html" class="mf-nav-link ${active === 'contact.html' ? 'active' : ''}" data-i18n="nav.contact">Contact</a></li>
            </ul>
          </nav>

          <div class="mf-nav-actions">
            <a href="dashboard.html" class="mf-btn mf-btn-secondary mf-btn-sm">
              <i data-lucide="layout-dashboard" style="width:15px;height:15px;"></i>
              <span data-i18n="nav.dashboard">Dashboard</span>
            </a>
            <a href="login.html" class="mf-btn mf-btn-ghost mf-btn-sm" data-i18n="nav.login">Login</a>
            <button type="button" class="mf-icon-btn" data-mf-theme-toggle aria-label="Switch Theme" title="Switch Theme">
              <span data-mf-theme-icon><i data-lucide="sun"></i></span>
            </button>
            <button type="button" class="mf-icon-btn mf-dir-pill" data-mf-dir-toggle aria-label="Switch RTL/LTR" title="Switch RTL / LTR Direction">
              <i data-lucide="arrow-left-right" style="width:14px;height:14px;"></i>
              <span data-mf-dir-label>RTL</span>
            </button>
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
            <a href="contact.html" class="mf-mobile-nav-link ${active === 'contact.html' ? 'active' : ''}">
              <span data-i18n="nav.contact">Contact</span>
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
                <i data-lucide="arrow-left-right" style="width:15px;height:15px;"></i>
                <span data-mf-dir-label>RTL</span>
              </button>
            </div>
            <a href="dashboard.html" class="mf-btn mf-btn-secondary w-100">
              <i data-lucide="layout-dashboard" style="width:16px;height:16px;"></i>
              <span data-i18n="nav.dashboard">Dashboard</span>
            </a>
            <a href="login.html" class="mf-btn mf-btn-ghost w-100" data-i18n="nav.login">Login</a>
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
              <div class="mf-footer-social" aria-label="Social Media Links">
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="mf-social-link" aria-label="X (Twitter)" title="X (Twitter)">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" class="mf-social-link" aria-label="LinkedIn" title="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://github.com/HTMLStaticWorks-Org/Email_Marketing_Software_SaaS" target="_blank" rel="noopener noreferrer" class="mf-social-link" aria-label="GitHub" title="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" class="mf-social-link" aria-label="YouTube" title="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" class="mf-social-link" aria-label="Instagram" title="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <div class="mf-footer-title">Product</div>
              <ul class="mf-footer-links">
                <li><a href="index.html">Home 1 (SaaS Overview)</a></li>
                <li><a href="home-2.html">Home 2 (Lifecycle Studio)</a></li>
                <li><a href="about.html">About MailFlow</a></li>
                <li><a href="services.html">Managed Services</a></li>
                <li><a href="features.html">Platform Features</a></li>
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
                <li><a href="contact.html" data-i18n="footer.contact">Contact Us</a></li>
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

  function initBackToTop() {
    if (document.getElementById('mf-back-to-top')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'mf-back-to-top';
    btn.className = 'mf-back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '<i data-lucide="arrow-up"></i>';
    document.body.appendChild(btn);

    const toggleVisibility = () => {
      btn.classList.toggle('is-visible', window.scrollY > 280);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderPublicNavbar();
    renderPublicFooter();
    initFaqAccordions();
    initBackToTop();
    if (window.MailFlowAppearance) {
      window.MailFlowAppearance.apply();
    }
    initAnimations();
  });
})(window, document, window.jQuery);

