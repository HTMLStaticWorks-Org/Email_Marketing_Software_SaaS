/* ==========================================================================
   MailFlow Pricing Interactive Billing & Demo Plan Selection
   ========================================================================== */

(function (window, document) {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const state = window.MailFlowStore.getState();
    let currentBilling = state.billingCycle === 'monthly' ? 'monthly' : 'yearly';
    let pendingPlan = null;

    function updatePricingDisplay(cycle) {
      currentBilling = cycle;
      window.MailFlowStore.setState({ billingCycle: cycle });

      document.querySelectorAll('.mf-billing-btn').forEach((btn) => {
        btn.classList.toggle('is-active', btn.getAttribute('data-billing') === cycle);
      });

      document.querySelectorAll('.mf-price-amount').forEach((el) => {
        const price = cycle === 'monthly'
          ? el.getAttribute('data-price-monthly')
          : el.getAttribute('data-price-yearly');
        el.textContent = '$' + price;
        const card = el.closest('.mf-pricing-card');
        const btn = card ? card.querySelector('.mf-select-plan-btn') : null;
        if (btn) btn.setAttribute('data-price', price);
      });
    }

    updatePricingDisplay(currentBilling);

    document.querySelectorAll('.mf-billing-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        updatePricingDisplay(btn.getAttribute('data-billing'));
      });
    });

    const modalEl = document.getElementById('mfPlanModal');
    const modal = modalEl && window.bootstrap ? new window.bootstrap.Modal(modalEl) : null;

    document.querySelectorAll('.mf-select-plan-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const plan = btn.getAttribute('data-plan');
        const price = btn.getAttribute('data-price');
        pendingPlan = { plan, price, billing: currentBilling };
        const summary = document.getElementById('mf-plan-modal-summary');
        if (summary) {
          summary.innerHTML = `You selected the <strong>${plan} Plan</strong> at <strong>$${price}/month</strong> (${currentBilling} billing).`;
        }
        if (modal) modal.show();
      });
    });

    const confirmBtn = document.getElementById('mf-confirm-plan-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (!pendingPlan) return;
        window.MailFlowAjax.post('pricing/select', pendingPlan).then(() => {
          window.MailFlowStore.setState({ selectedPlan: pendingPlan });
          if (modal) modal.hide();
          window.MailFlowAppearance.toast(`${pendingPlan.plan} demo plan activated! Opening dashboard...`, 'success');
          setTimeout(() => {
            window.location.href = 'dashboard.html#overview';
          }, 700);
        });
      });
    }

    const salesForm = document.getElementById('mf-contact-sales-form');
    if (salesForm) {
      salesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (document.getElementById('sales-name').value || '').trim();
        const email = (document.getElementById('sales-email').value || '').trim();
        const volume = document.getElementById('sales-volume').value;
        if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          window.MailFlowAppearance.toast('Please enter your full name and a valid work email.', 'error');
          return;
        }
        window.MailFlowAjax.post('sales/inquiry', { name, email, volume }).then(() => {
          salesForm.reset();
          window.MailFlowAppearance.toast(`Demo sales inquiry logged for ${name} (${volume}).`, 'success');
        });
      });
    }
  });
})(window, document);

