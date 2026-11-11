/* ==========================================================================
   MailFlow Contact Page Interactions & Form Submission
   ========================================================================== */

(function (window, document) {
  'use strict';

  function initContactPage() {
    const form = document.getElementById('mf-contact-form');
    if (!form) return;

    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const companyEl = document.getElementById('contact-company');
    const topicEl = document.getElementById('contact-topic');
    const volumeEl = document.getElementById('contact-volume');
    const messageEl = document.getElementById('contact-message');
    const submitBtn = document.getElementById('mf-contact-submit');
    const feedbackBox = document.getElementById('mf-contact-confirmation');
    const refSpan = document.getElementById('mf-contact-ref');

    function setInvalid(input, bad) {
      if (!input) return;
      input.classList.toggle('is-invalid', Boolean(bad));
    }

    [nameEl, emailEl, messageEl].forEach((field) => {
      if (!field) return;
      field.addEventListener('input', () => setInvalid(field, false));
    });

    document.querySelectorAll('[data-contact-topic]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const chosen = btn.getAttribute('data-contact-topic');
        if (topicEl && chosen) {
          topicEl.value = chosen;
        }
        const formSection = document.getElementById('contact-form-section');
        if (formSection) {
          e.preventDefault();
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (nameEl) nameEl.focus({ preventScroll: true });
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = (nameEl.value || '').trim();
      const emailVal = (emailEl.value || '').trim();
      const msgVal = (messageEl.value || '').trim();

      const badName = nameVal.length < 2;
      const badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      const badMsg = msgVal.length < 10;

      setInvalid(nameEl, badName);
      setInvalid(emailEl, badEmail);
      setInvalid(messageEl, badMsg);

      if (badName || badEmail || badMsg) {
        if (window.MailFlowAppearance) {
          window.MailFlowAppearance.toast('Please complete all required fields cleanly before sending.', 'error');
        }
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.textContent = 'Sending...';

      const payload = {
        name: nameVal,
        email: emailVal,
        company: (companyEl && companyEl.value ? companyEl.value : '').trim(),
        topic: topicEl ? topicEl.value : 'Product Demo & Enterprise',
        volume: volumeEl ? volumeEl.value : '50k - 250k / mo',
        message: msgVal
      };

      const sendPromise = window.MailFlowAjax
        ? window.MailFlowAjax.post('contact/submit', payload)
        : Promise.resolve({ ok: true });

      Promise.resolve(sendPromise).then(() => {
        const refId = 'MF-2026-' + Math.floor(1000 + Math.random() * 9000);
        if (refSpan) refSpan.textContent = refId;
        if (feedbackBox) feedbackBox.classList.remove('d-none');

        if (window.MailFlowStore) {
          const state = window.MailFlowStore.getState();
          const list = Array.isArray(state.contactInquiries) ? state.contactInquiries : [];
          list.unshift({ ...payload, refId, createdAt: new Date().toISOString() });
          window.MailFlowStore.update({ contactInquiries: list.slice(0, 10) });
        }

        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (window.MailFlowAppearance) {
          window.MailFlowAppearance.toast(`Message received (${refId}). Confirmation sent to ${emailVal}.`, 'success');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initContactPage);
})(window, document);

