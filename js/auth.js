/* ==========================================================================
   MailFlow Authentication Demo Logic (Login & Register)
   ========================================================================== */

(function (window, document) {
  'use strict';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldValidity(input, valid) {
    if (!input) return valid;
    input.classList.toggle('is-invalid', !valid);
    return valid;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggles
    document.querySelectorAll('[data-toggle-pass]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-toggle-pass');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        btn.innerHTML = `<i data-lucide="${isPass ? 'eye-off' : 'eye'}" style="width:18px;height:18px;"></i>`;
        if (window.lucide) window.lucide.createIcons({ root: btn });
      });
    });

    // Auto-fill Demo Credentials
    const fillBtn = document.getElementById('mf-fill-demo-login');
    if (fillBtn) {
      fillBtn.addEventListener('click', () => {
        document.getElementById('login-email').value = 'elena@northstarlabs.io';
        document.getElementById('login-password').value = 'MailFlow2026!';
        setFieldValidity(document.getElementById('login-email'), true);
        setFieldValidity(document.getElementById('login-password'), true);
      });
    }

    // Google Login Demo
    const googleBtn = document.getElementById('mf-google-demo-btn');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        window.MailFlowAjax.post('auth/google', { provider: 'google-demo' }).then(() => {
          window.MailFlowStore.setState((prev) => ({
            ...prev,
            session: { ...prev.session, loggedIn: true }
          }));
          window.MailFlowAppearance.toast('Signed in via Google Demo UI! Redirecting...', 'success');
          setTimeout(() => { window.location.href = 'dashboard.html#overview'; }, 600);
        });
      });
    }

    // Login Form Validation & Submission
    const loginForm = document.getElementById('mf-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailEl = document.getElementById('login-email');
        const passEl = document.getElementById('login-password');
        const remember = document.getElementById('login-remember').checked;

        const okEmail = setFieldValidity(emailEl, EMAIL_RE.test((emailEl.value || '').trim()));
        const okPass = setFieldValidity(passEl, (passEl.value || '').length >= 6);

        if (!okEmail || !okPass) {
          window.MailFlowAppearance.toast('Please fix the highlighted login fields.', 'error');
          return;
        }

        const email = emailEl.value.trim();
        window.MailFlowAjax.post('auth/login', { email, remember }).then(() => {
          window.MailFlowStore.setState((prev) => ({
            ...prev,
            session: {
              ...prev.session,
              loggedIn: true,
              rememberMe: remember,
              user: { ...prev.session.user, email }
            }
          }));
          window.MailFlowAppearance.toast('Signed in to Marketer Dashboard (Demo Mode).', 'success');
          setTimeout(() => { window.location.href = 'dashboard.html#overview'; }, 600);
        });
      });
    }

    // Forgot Password Form
    const forgotForm = document.getElementById('mf-forgot-form');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('forgot-email').value || '').trim();
        if (!EMAIL_RE.test(email)) {
          window.MailFlowAppearance.toast('Please enter a valid email address.', 'error');
          return;
        }
        window.MailFlowAjax.post('auth/forgot', { email }).then(() => {
          const modalEl = document.getElementById('mfForgotModal');
          if (modalEl && window.bootstrap) {
            const inst = window.bootstrap.Modal.getInstance(modalEl);
            if (inst) inst.hide();
          }
          forgotForm.reset();
          window.MailFlowAppearance.toast(`Demo password reset link simulated for ${email}.`, 'success');
        });
      });
    }

    // Register Form Validation & Submission
    const regForm = document.getElementById('mf-register-form');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameEl = document.getElementById('reg-name');
        const emailEl = document.getElementById('reg-email');
        const companyEl = document.getElementById('reg-company');
        const passEl = document.getElementById('reg-password');
        const confirmEl = document.getElementById('reg-confirm');
        const termsEl = document.getElementById('reg-terms');
        const termsErr = document.getElementById('reg-terms-err');

        const okName = setFieldValidity(nameEl, (nameEl.value || '').trim().length >= 2);
        const okEmail = setFieldValidity(emailEl, EMAIL_RE.test((emailEl.value || '').trim()));
        const okComp = setFieldValidity(companyEl, (companyEl.value || '').trim().length >= 2);
        const okPass = setFieldValidity(passEl, (passEl.value || '').length >= 6);
        const okConfirm = setFieldValidity(confirmEl, confirmEl.value === passEl.value && confirmEl.value.length >= 6);
        const okTerms = termsEl.checked;
        if (termsErr) termsErr.style.display = okTerms ? 'none' : 'block';

        if (!okName || !okEmail || !okComp || !okPass || !okConfirm || !okTerms) {
          window.MailFlowAppearance.toast('Please complete all required registration fields.', 'error');
          return;
        }

        const user = {
          name: nameEl.value.trim(),
          email: emailEl.value.trim(),
          company: companyEl.value.trim(),
          role: 'Workspace Owner',
          avatar: 'https://randomuser.me/api/portraits/women/88.jpg'
        };

        window.MailFlowAjax.post('auth/register', user).then(() => {
          window.MailFlowStore.setState((prev) => ({
            ...prev,
            session: { ...prev.session, loggedIn: true, user },
            sender: { ...prev.sender, name: `${user.company} Team`, email: user.email }
          }));
          window.MailFlowAppearance.toast(`Demo account created for ${user.company}! Opening dashboard...`, 'success');
          setTimeout(() => { window.location.href = 'dashboard.html#overview'; }, 650);
        });
      });
    }
  });
})(window, document);

