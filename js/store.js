/* ==========================================================================
   MailFlow State Store (localStorage-backed Demo Persistence)
   Clearly separates frontend demo state from real server email/auth/billing.
   ========================================================================== */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'mailflow_saas_state_v2';

  const DEFAULT_STATE = {
    theme: 'dark',
    dir: 'ltr',
    lang: 'en',
    billingCycle: 'yearly',
    session: {
      loggedIn: false,
      rememberMe: true,
      user: {
        name: 'Elena Vance',
        email: 'elena@northstarlabs.io',
        company: 'Northstar Labs',
        role: 'Head of Lifecycle Marketing',
        avatar: 'https://randomuser.me/api/portraits/women/88.jpg'
      }
    },
    sender: {
      name: 'Northstar Labs Team',
      email: 'hello@northstarlabs.io',
      replyTo: 'support@northstarlabs.io',
      domainVerified: true
    },
    notifications: {
      campaignSent: true,
      weeklyDigest: true,
      bounceAlerts: true,
      automationErrors: true
    },
    recentActivity: [
      { id: 'act-1', text: 'Q4 Product Launch campaign reached 48.2% open rate', time: '12 mins ago', type: 'success' },
      { id: 'act-2', text: 'Abandoned Cart Recovery automation triggered 142 times', time: '1 hour ago', type: 'primary' },
      { id: 'act-3', text: '318 new subscribers synced from Shopify VIP Checkout', time: '3 hours ago', type: 'info' },
      { id: 'act-4', text: 'Holiday Flash Sale draft saved by Elena Vance', time: 'Yesterday', type: 'neutral' }
    ],
    campaigns: [
      {
        id: 'cmp-101',
        name: 'Q4 AI Workflow Release',
        subject: 'Meet MailFlow 3.0: Smarter Trigger Paths for Every Team',
        senderName: 'Northstar Labs Team',
        senderEmail: 'hello@northstarlabs.io',
        list: 'Active Product Users',
        status: 'Sent',
        sentAt: '2026-11-04',
        recipients: 18420,
        openRate: 49.4,
        ctr: 11.8,
        bounceRate: 0.4,
        unsubscribeRate: 0.12,
        previewBody: 'Discover visual branching, instant deliverability scoring, and predictive send-time optimization in MailFlow 3.0.'
      },
      {
        id: 'cmp-102',
        name: 'Black Friday Early Access',
        subject: 'VIP Preview: 40% Off Annual Plans Ends Friday',
        senderName: 'Elena from Northstar',
        senderEmail: 'elena@northstarlabs.io',
        list: 'VIP Trial & Customers',
        status: 'Scheduled',
        sentAt: '2026-11-18',
        recipients: 12950,
        openRate: 0,
        ctr: 0,
        bounceRate: 0,
        unsubscribeRate: 0,
        previewBody: 'Lock in your early-bird SaaS upgrade before public launch. Includes unlimited automation nodes and priority IP warming.'
      },
      {
        id: 'cmp-103',
        name: 'October Deliverability Benchmark',
        subject: 'How 4,200 SaaS Brands Achieved 99.3% Inbox Placement',
        senderName: 'Northstar Insights',
        senderEmail: 'insights@northstarlabs.io',
        list: 'Newsletter Subscribers',
        status: 'Sent',
        sentAt: '2026-10-24',
        recipients: 24610,
        openRate: 44.7,
        ctr: 9.2,
        bounceRate: 0.5,
        unsubscribeRate: 0.18,
        previewBody: 'Our quarterly breakdown of DMARC adoption, sunsetting cold contacts, and personalized subject lines.'
      },
      {
        id: 'cmp-104',
        name: 'Winter Webinar Invitation',
        subject: 'Live Workshop: Building Zero-Waste Drip Sequences',
        senderName: 'Northstar Events',
        senderEmail: 'events@northstarlabs.io',
        list: 'Marketing Leaders',
        status: 'Draft',
        sentAt: '2026-11-22',
        recipients: 8300,
        openRate: 0,
        ctr: 0,
        bounceRate: 0,
        unsubscribeRate: 0,
        previewBody: 'Reserve your seat for our 45-minute live walkthrough of lifecycle scoring and dynamic email blocks.'
      },
      {
        id: 'cmp-105',
        name: 'Re-engagement Sunset Flow',
        subject: 'Still want our weekly SaaS growth playbooks?',
        senderName: 'Northstar Labs Team',
        senderEmail: 'hello@northstarlabs.io',
        list: 'Cold Contacts (90d)',
        status: 'Paused',
        sentAt: '2026-10-11',
        recipients: 3420,
        openRate: 28.9,
        ctr: 4.6,
        bounceRate: 0.9,
        unsubscribeRate: 1.4,
        previewBody: 'Update your email preferences in one click so we only send the product tips and templates you care about.'
      },
      {
        id: 'cmp-106',
        name: 'Enterprise Security Update',
        subject: 'SOC 2 Type II & Custom SAML SSO Now Available',
        senderName: 'Northstar Security',
        senderEmail: 'security@northstarlabs.io',
        list: 'Enterprise Accounts',
        status: 'Sent',
        sentAt: '2026-10-02',
        recipients: 4180,
        openRate: 61.2,
        ctr: 15.4,
        bounceRate: 0.2,
        unsubscribeRate: 0.05,
        previewBody: 'Review our updated compliance center, role-based permissions, and dedicated IP pool guarantees.'
      }
    ],
    contacts: [
      { id: 'cnt-1', name: 'Amira Al-Mansoor', email: 'amira@crescentstudio.ae', company: 'Crescent Studio', location: 'Dubai, UAE', status: 'Active', engagement: 'High', activity: 'Opened 5/5', group: 'VIP Customers', tags: ['VIP', 'Enterprise'], joined: '2026-08-14' },
      { id: 'cnt-2', name: 'Marcus Chen', email: 'mchen@vervecommerce.com', company: 'Verve Commerce', location: 'San Francisco, US', status: 'Active', engagement: 'High', activity: 'Clicked CTA', group: 'Active Product Users', tags: ['Shopify', 'SaaS'], joined: '2026-09-03' },
      { id: 'cnt-3', name: 'Sofia Lindqvist', email: 'sofia@nordicpay.se', company: 'NordicPay', location: 'Stockholm, SE', status: 'Active', engagement: 'Medium', activity: 'Opened 2/5', group: 'Newsletter Subscribers', tags: ['Fintech', 'Newsletter'], joined: '2026-09-22' },
      { id: 'cnt-4', name: 'Daniel Okafor', email: 'd.okafor@kinetix.io', company: 'Kinetix Cloud', location: 'London, UK', status: 'New', engagement: 'High', activity: 'Signed up today', group: 'Trial Leads', tags: ['Trial', 'Product'], joined: '2026-11-09' },
      { id: 'cnt-5', name: 'Clara Moreau', email: 'clara@atelierbloom.fr', company: 'Atelier Bloom', location: 'Paris, FR', status: 'Unsubscribed', engagement: 'Low', activity: 'Unsubscribed', group: 'Ecommerce Brands', tags: ['Retail'], joined: '2026-04-18' },
      { id: 'cnt-6', name: 'Tariq Haddad', email: 'tariq@riyadhcloud.sa', company: 'Riyadh Cloud', location: 'Riyadh, SA', status: 'Active', engagement: 'High', activity: 'Opened 4/5', group: 'VIP Customers', tags: ['VIP', 'RTL-User'], joined: '2026-07-30' },
      { id: 'cnt-7', name: 'Hannah Brooks', email: 'hannah@luminahealth.co', company: 'Lumina Health', location: 'Austin, US', status: 'New', engagement: 'Medium', activity: 'Confirmed opt-in', group: 'Trial Leads', tags: ['Trial', 'Healthcare'], joined: '2026-11-08' },
      { id: 'cnt-8', name: 'Kenji Takahashi', email: 'kenji@soratech.jp', company: 'SoraTech', location: 'Tokyo, JP', status: 'Active', engagement: 'Low', activity: 'No open 45d', group: 'Newsletter Subscribers', tags: ['Developer'], joined: '2026-05-12' }
    ],
    segments: [
      { id: 'seg-1', name: 'Highly Engaged VIPs', activity: 'Opened 5/5', location: 'All Locations', engagement: 'High', description: 'Contacts with high open frequency and VIP or Enterprise tags.' },
      { id: 'seg-2', name: 'Fresh Trial Signups', activity: 'Signed up recently', location: 'All Locations', engagement: 'High', description: 'New leads who joined within the last 14 days and confirmed opt-in.' },
      { id: 'seg-3', name: 'MENA Enterprise Leads', activity: 'Active', location: 'UAE / SA', engagement: 'High', description: 'Regional enterprise marketers across Dubai and Riyadh.' },
      { id: 'seg-4', name: 'Dormant Re-engagement Pool', activity: 'No open 30d+', location: 'All Locations', engagement: 'Low', description: 'Subscribers with low engagement eligible for sunset automation.' }
    ],
    workflows: [
      {
        id: 'wf-1',
        name: 'Welcome Email Automation',
        trigger: 'New Contact Joins List',
        status: 'Active',
        enrolled: 4280,
        conversion: '38.4%',
        nodes: [
          { id: 'n1', kind: 'trigger', title: 'Subscriber Joined', detail: 'List: Trial Leads & Newsletter' },
          { id: 'n2', kind: 'action', title: 'Send Welcome Email #1', detail: 'Template: SaaS Warm Welcome' },
          { id: 'n3', kind: 'condition', title: 'Wait 2 Days · Opened Email?', detail: 'Branch Yes / No on open event' },
          { id: 'n4', kind: 'action', title: 'Send Product Tour Guide', detail: 'Includes 3-minute setup checklist' }
        ]
      },
      {
        id: 'wf-2',
        name: 'Abandoned Cart Automation',
        trigger: 'Checkout Started Without Purchase',
        status: 'Active',
        enrolled: 1940,
        conversion: '24.1%',
        nodes: [
          { id: 'n1', kind: 'trigger', title: 'Cart Abandoned (1 Hour)', detail: 'Source: Shopify / Stripe Checkout' },
          { id: 'n2', kind: 'condition', title: 'Cart Value > $100?', detail: 'Segments high-value orders' },
          { id: 'n3', kind: 'action', title: 'Send Dynamic Cart Reminder', detail: 'Includes 10% recovery incentive' }
        ]
      },
      {
        id: 'wf-3',
        name: 'Birthday Email Automation',
        trigger: 'Subscriber Anniversary / Birthday',
        status: 'Active',
        enrolled: 860,
        conversion: '44.0%',
        nodes: [
          { id: 'n1', kind: 'trigger', title: 'Date Match: Birthday', detail: 'Runs daily at 09:00 local time' },
          { id: 'n2', kind: 'action', title: 'Send Personalized Gift Offer', detail: 'Custom promo code attached' }
        ]
      },
      {
        id: 'wf-4',
        name: 'New Subscriber Automation',
        trigger: 'Double Opt-In Confirmed',
        status: 'Active',
        enrolled: 3120,
        conversion: '52.6%',
        nodes: [
          { id: 'n1', kind: 'trigger', title: 'Opt-In Verified', detail: 'Tag: Newsletter Subscribers' },
          { id: 'n2', kind: 'action', title: 'Apply Engagement Tag', detail: 'Tag: Verified-2026' },
          { id: 'n3', kind: 'action', title: 'Deliver Lead Magnet PDF', detail: '2026 Deliverability Playbook' }
        ]
      },
      {
        id: 'wf-5',
        name: 'Customer Re-engagement',
        trigger: 'No Email Open in 60 Days',
        status: 'Paused',
        enrolled: 1120,
        conversion: '16.8%',
        nodes: [
          { id: 'n1', kind: 'trigger', title: 'Inactivity Threshold (60d)', detail: 'Engagement Score < 25' },
          { id: 'n2', kind: 'action', title: 'Send "We Miss You" Offer', detail: 'One-click preference center' },
          { id: 'n3', kind: 'condition', title: 'Clicked Within 7 Days?', detail: 'Suppress non-responders automatically' }
        ]
      }
    ],
    templates: [
      {
        id: 'tpl-1',
        name: 'SaaS Monthly Digest',
        category: 'Newsletter',
        description: 'Clean two-column product digest with metrics callout and editorial hero.',
        subject: 'Your November Product Updates & Growth Metrics',
        image: 'assets/img/a%20(2).jpg',
        blocks: [
          { id: 'b1', type: 'heading', text: 'November Growth Digest', align: 'center', color: '#8B5CF6' },
          { id: 'b2', type: 'image', src: 'assets/img/a%20(2).jpg', alt: 'MailFlow newsletter mobile icons' },
          { id: 'b3', type: 'paragraph', text: 'This month we shipped predictive send-time optimization, instant RTL email previews, and 2x faster segment evaluation.' },
          { id: 'b4', type: 'button', label: 'Explore Release Notes', url: 'https://mailflow.app/releases', bg: '#8B5CF6' },
          { id: 'b5', type: 'divider' },
          { id: 'b6', type: 'social', networks: ['X', 'LinkedIn', 'GitHub'] }
        ]
      },
      {
        id: 'tpl-2',
        name: 'Seasonal Flash Offer',
        category: 'Promotional',
        description: 'High-contrast promotional announcement built for ecommerce and SaaS upgrades.',
        subject: '48 Hours Only: Save 35% on Annual Automations',
        image: 'assets/img/a%20(15).jpg',
        blocks: [
          { id: 'b1', type: 'heading', text: 'Unlock 35% Off Annual Plans', align: 'center', color: '#7C3AED' },
          { id: 'b2', type: 'imageText', src: 'assets/img/a%20(15).jpg', heading: 'Built for High-Velocity Teams', text: 'Upgrade before midnight Friday to lock in unlimited contact segments and dedicated IP warming.' },
          { id: 'b3', type: 'button', label: 'Claim Annual Savings', url: 'https://mailflow.app/pricing', bg: '#7C3AED' }
        ]
      },
      {
        id: 'tpl-3',
        name: 'Warm Onboarding Welcome',
        category: 'Welcome Email',
        description: 'First-touch welcome email guiding new signups to launch their first flow.',
        subject: 'Welcome to MailFlow — Launch your first campaign in 3 minutes',
        image: 'assets/img/a%20(4).jpg',
        blocks: [
          { id: 'b1', type: 'heading', text: 'Welcome aboard, {{first_name}}!', align: 'left', color: '#8B5CF6' },
          { id: 'b2', type: 'image', src: 'assets/img/a%20(4).jpg', alt: 'Welcome onboarding email screen' },
          { id: 'b3', type: 'paragraph', text: 'You are three steps away from automating smarter subscriber journeys. Import your audience or start with a battle-tested template.' },
          { id: 'b4', type: 'button', label: 'Open Marketer Dashboard', url: 'https://mailflow.app/dashboard', bg: '#8B5CF6' }
        ]
      },
      {
        id: 'tpl-4',
        name: 'AI Feature Launch Spotlight',
        category: 'Product Announcement',
        description: 'Minimalist announcement inspired by Resend and Loops for major launches.',
        subject: 'Introducing Smart Deliverability Guardrails',
        image: 'assets/img/a%20(26).jpg',
        blocks: [
          { id: 'b1', type: 'heading', text: 'Introducing Deliverability Guardrails', align: 'center', color: '#8B5CF6' },
          { id: 'b2', type: 'image', src: 'assets/img/a%20(26).jpg', alt: 'Clean SaaS product launch laptop' },
          { id: 'b3', type: 'paragraph', text: 'Detect domain DNS issues, spam-trap patterns, and risky copy before you hit Send.' },
          { id: 'b4', type: 'button', label: 'Try Guardrails Now', url: 'https://mailflow.app/features', bg: '#8B5CF6' }
        ]
      },
      {
        id: 'tpl-5',
        name: 'SaaS Summit VIP Invite',
        category: 'Event Invitation',
        description: 'Modern event invitation with speaker spotlight and one-click RSVP.',
        subject: 'You’re Invited: MailFlow Lifecycle Summit 2026',
        image: 'assets/img/a%20(21).jpg',
        blocks: [
          { id: 'b1', type: 'heading', text: 'MailFlow Lifecycle Summit 2026', align: 'center', color: '#7C3AED' },
          { id: 'b2', type: 'image', src: 'assets/img/a%20(21).jpg', alt: 'Growth marketer inviting attendees' },
          { id: 'b3', type: 'paragraph', text: 'Join 1,500+ growth leaders for live teardown sessions on retention automation and AI personalization.' },
          { id: 'b4', type: 'button', label: 'Reserve Free Pass', url: 'https://mailflow.app/summit', bg: '#7C3AED' }
        ]
      },
      {
        id: 'tpl-6',
        name: 'Clean Receipt & Invoice',
        category: 'Transactional',
        description: 'Crystal-clear billing confirmation and security alert template.',
        subject: 'Your MailFlow Subscription Receipt #MF-2094',
        image: 'assets/img/a%20(23).jpg',
        blocks: [
          { id: 'b1', type: 'heading', text: 'Payment Confirmed — Receipt #MF-2094', align: 'left', color: '#8B5CF6' },
          { id: 'b2', type: 'image', src: 'assets/img/a%20(23).jpg', alt: 'Clean workstation billing confirmation' },
          { id: 'b3', type: 'paragraph', text: 'Thank you for renewing your MailFlow Growth Plan ($79/mo billed annually). Download your VAT-compliant PDF invoice anytime.' },
          { id: 'b4', type: 'button', label: 'Download Invoice PDF', url: 'https://mailflow.app/billing', bg: '#8B5CF6' }
        ]
      }
    ],
    integrations: [
      { id: 'int-1', name: 'Shopify', category: 'Ecommerce', icon: 'shopping-bag', desc: 'Sync orders, abandoned carts, and customer lifetime value in real time.', connected: true },
      { id: 'int-2', name: 'WooCommerce', category: 'Ecommerce', icon: 'store', desc: 'Trigger post-purchase and product restock sequences automatically.', connected: false },
      { id: 'int-3', name: 'HubSpot CRM', category: 'CRM', icon: 'users', desc: 'Bi-directional contact properties, deal stages, and lead scoring sync.', connected: true },
      { id: 'int-4', name: 'Salesforce', category: 'CRM', icon: 'cloud', desc: 'Enterprise account mapping and campaign attribution inside Salesforce.', connected: false },
      { id: 'int-5', name: 'Google Analytics 4', category: 'Analytics', icon: 'bar-chart-3', desc: 'Automatic UTM tagging and conversion funnel tracking across campaigns.', connected: true },
      { id: 'int-6', name: 'Mixpanel', category: 'Analytics', icon: 'activity', desc: 'Trigger lifecycle emails directly from in-app behavioral events.', connected: false },
      { id: 'int-7', name: 'Webflow', category: 'Website Platforms', icon: 'globe', desc: 'Capture native signup forms directly into MailFlow segments.', connected: true },
      { id: 'int-8', name: 'WordPress', category: 'Website Platforms', icon: 'layout', desc: 'Embed newsletter opt-in blocks and sync member subscriptions.', connected: false },
      { id: 'int-9', name: 'Stripe', category: 'Payment Platforms', icon: 'credit-card', desc: 'Automate failed-payment dunning, receipts, and expansion upgrades.', connected: true },
      { id: 'int-10', name: 'Lemon Squeezy', category: 'Payment Platforms', icon: 'wallet', desc: 'Sync SaaS license activations and renewal reminders effortlessly.', connected: false },
      { id: 'int-11', name: 'Zapier', category: 'Automation Tools', icon: 'zap', desc: 'Connect MailFlow to 6,000+ apps with instant webhook triggers.', connected: true },
      { id: 'int-12', name: 'Make (Integromat)', category: 'Automation Tools', icon: 'workflow', desc: 'Build multi-step custom API scenarios without writing backend code.', connected: false }
    ],
    builderDraft: {
      templateName: 'Q4 Product Spotlight',
      subject: 'Discover What Is New in MailFlow',
      blocks: [
        { id: 'blk-1', type: 'heading', text: 'Turn Every Email Into an Opportunity.', align: 'center', color: '#8B5CF6' },
        { id: 'blk-2', type: 'image', src: 'assets/img/a%20(5).jpg', alt: 'Inbox campaign preview on laptop' },
        { id: 'blk-3', type: 'paragraph', text: 'Design responsive campaigns in minutes, personalize content with dynamic audience tokens, and preview desktop & mobile layouts before hitting send.' },
        { id: 'blk-4', type: 'button', label: 'Start Free Trial', url: 'https://mailflow.app/register', bg: '#8B5CF6' },
        { id: 'blk-5', type: 'divider' },
        { id: 'blk-6', type: 'social', networks: ['X', 'LinkedIn', 'YouTube'] }
      ]
    }
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return Object.assign(deepClone(DEFAULT_STATE), parsed);
    } catch (e) {
      return deepClone(DEFAULT_STATE);
    }
  }

  function saveState(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Ignore storage quota errors in private browsing
    }
  }

  let currentState = loadState();

  const MailFlowStore = {
    getState() {
      return currentState;
    },
    setState(updater) {
      if (typeof updater === 'function') {
        currentState = updater(currentState) || currentState;
      } else {
        currentState = Object.assign({}, currentState, updater);
      }
      saveState(currentState);
      window.dispatchEvent(new CustomEvent('mailflow:statechange', { detail: currentState }));
      return currentState;
    },
    resetDemoData() {
      const preservedTheme = currentState.theme;
      const preservedDir = currentState.dir;
      const preservedLang = currentState.lang;
      currentState = deepClone(DEFAULT_STATE);
      currentState.theme = preservedTheme;
      currentState.dir = preservedDir;
      currentState.lang = preservedLang;
      saveState(currentState);
      window.dispatchEvent(new CustomEvent('mailflow:statechange', { detail: currentState }));
      return currentState;
    },
    computeSegmentCount(segment) {
      const contacts = currentState.contacts || [];
      return contacts.filter((c) => {
        if (segment.engagement && segment.engagement !== 'All' && c.engagement !== segment.engagement) return false;
        if (segment.location && segment.location !== 'All Locations') {
          if (segment.location === 'UAE / SA' && !/UAE|SA/i.test(c.location)) return false;
          if (segment.location !== 'UAE / SA' && !c.location.toLowerCase().includes(segment.location.toLowerCase())) return false;
        }
        if (segment.activity && segment.activity !== 'All') {
          if (segment.activity === 'Opened 5/5' && !/5\/5|Clicked/i.test(c.activity)) return false;
          if (segment.activity === 'No open 30d+' && c.engagement !== 'Low') return false;
          if (segment.activity === 'Signed up recently' && c.status !== 'New') return false;
        }
        return true;
      }).length;
    }
  };

  window.MailFlowStore = MailFlowStore;
})(window);

