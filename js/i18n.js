/* ==========================================================================
   MailFlow Internationalization (English LTR & Arabic RTL)
   ========================================================================== */

(function (window) {
  'use strict';

  const DICTIONARY = {
    en: {
      'brand.name': 'MailFlow',
      'brand.tagline': 'Every Email. Smarter Connections.',
      'nav.home': 'Home',
      'nav.home2': 'Home 2',
      'nav.features': 'Features',
      'nav.services': 'Services',
      'nav.about': 'About',
      'nav.pricing': 'Pricing',
      'nav.login': 'Login',
      'nav.getStarted': 'Get Started',
      'nav.dashboard': 'Dashboard',
      'nav.themeToLight': 'Switch to Light Mode',
      'nav.themeToDark': 'Switch to Dark Mode',
      'nav.dirToRtl': 'RTL / العربية',
      'nav.dirToLtr': 'LTR / EN',
      'hero.eyebrow': '2026 Email Marketing & Lifecycle Automation',
      'hero.title': 'Turn Every Email Into an Opportunity.',
      'hero.desc': 'Design high-converting campaigns, automate visual customer journeys, and track real-time revenue attribution inside one unified workspace built for modern SaaS and ecommerce teams.',
      'hero.ctaPrimary': 'Get Started Free',
      'hero.ctaSecondary': 'Explore Features',
      'home.statsTitle': 'Proven Deliverability at SaaS Scale',
      'home.workflowTitle': 'Visual Automation That Works While You Sleep',
      'home.featuresTitle': 'Everything Marketers Need to Grow Faster',
      'home.howTitle': 'How MailFlow Works',
      'home.audienceTitle': 'Precision Audience Management',
      'home.perfTitle': 'Real-Time Campaign Performance',
      'home.integrationsTitle': 'Connects Seamlessly With Your Stack',
      'home.testimonialsTitle': 'Loved by High-Growth Marketing Teams',
      'home.faqTitle': 'Frequently Asked Questions',
      'home.ctaTitle': 'Ready to Build Smarter Email Connections?',
      'home.ctaDesc': 'Launch your first automated workflow in under five minutes. Demo workspace included — no credit card required.',
      'features.heroTitle': 'Built for Speed, Precision & Deliverability.',
      'features.heroDesc': 'Every capability inside MailFlow is crafted with its own dedicated workspace — from drag-and-drop block editing to multi-branch automation.',
      'home2.heroTitle': 'Automate Revenue, Not Busywork.',
      'home2.heroDesc': 'Combine visual customer journeys with instant behavioral triggers. Built for marketing teams who want Resend-level clarity and Customer.io-level automation depth.',
      'about.heroTitle': 'Building the Most Thoughtful Email Engine of 2026.',
      'about.heroDesc': 'MailFlow was founded to give growth marketers, SaaS founders, and ecommerce teams one calm, reliable platform where deliverability engineering meets intuitive visual automation.',
      'services.heroTitle': 'Expert Deliverability & Lifecycle Strategy, On Demand.',
      'services.heroDesc': 'Pair MailFlow’s self-serve SaaS platform with hands-on migration, IP warming, custom RTL template design, and workflow architecture led by our specialists.',
      'pricing.heroTitle': 'Transparent Pricing That Scales With Your Audience.',
      'pricing.heroDesc': 'Start free with core automation, then unlock higher send limits, A/B testing, and dedicated deliverability as you grow.',
      'pricing.monthly': 'Monthly',
      'pricing.yearly': 'Yearly (Save 20%)',
      'pricing.recommended': 'Recommended',
      'auth.loginTitle': 'Welcome back to MailFlow',
      'auth.loginSubtitle': 'Sign in to access your Marketer Dashboard',
      'auth.registerTitle': 'Create your MailFlow account',
      'auth.registerSubtitle': 'Start automating smarter customer journeys in minutes',
      'dash.overview': 'Overview',
      'dash.campaigns': 'Campaigns',
      'dash.builder': 'Email Builder',
      'dash.contacts': 'Contacts',
      'dash.segments': 'Segments',
      'dash.automation': 'Automation',
      'dash.templates': 'Templates',
      'dash.analytics': 'Analytics',
      'dash.integrations': 'Integrations',
      'dash.settings': 'Settings',
      'dash.logout': 'Logout',
      'dash.demoBanner': 'Frontend Demo Mode — Actions persist locally in your browser; no live emails or payments are sent.',
      'footer.newsletterTitle': 'Stay ahead in lifecycle marketing',
      'footer.newsletterBtn': 'Subscribe',
      'footer.copyright': '© 2026 MailFlow SaaS. Frontend interactive product showcase.'
    },
    ar: {
      'brand.name': 'MailFlow',
      'brand.tagline': 'كل رسالة بريد. تواصل أذكى.',
      'nav.home': 'الرئيسية',
      'nav.home2': 'الرئيسية 2',
      'nav.features': 'المميزات',
      'nav.services': 'الخدمات',
      'nav.about': 'من نحن',
      'nav.pricing': 'الأسعار',
      'nav.login': 'تسجيل الدخول',
      'nav.getStarted': 'ابدأ الآن',
      'nav.dashboard': 'لوحة التحكم',
      'nav.themeToLight': 'التبديل إلى الوضع الفاتح',
      'nav.themeToDark': 'التبديل إلى الوضع الداكن',
      'nav.dirToRtl': 'RTL / العربية',
      'nav.dirToLtr': 'LTR / EN',
      'hero.eyebrow': 'منصة التسويق عبر البريد والأتمتة لعام 2026',
      'hero.title': 'حوّل كل رسالة بريد إلكتروني إلى فرصة حقيقية.',
      'hero.desc': 'صمّم حملات عالية التحويل، وأتمت رحلات العملاء بصرياً، وتابع نتائج الأداء في الوقت الفعلي ضمن منصة واحدة حديثة لفرق التسويق.',
      'hero.ctaPrimary': 'ابدأ مجاناً',
      'hero.ctaSecondary': 'استكشف المميزات',
      'home.statsTitle': 'موثوقية وصول عالية على نطاق المؤسسات',
      'home.workflowTitle': 'أتمتة بصرية تعمل من أجلك على مدار الساعة',
      'home.featuresTitle': 'كل ما يحتاجه المسوّقون للنمو السريع',
      'home.howTitle': 'كيف يعمل MailFlow',
      'home.audienceTitle': 'إدارة دقيقة للجمهور والشرائح',
      'home.perfTitle': 'تحليل أداء الحملات لحظة بلحظة',
      'home.integrationsTitle': 'تكامل سلس مع أدواتك المفضلة',
      'home.testimonialsTitle': 'آراء فرق التسويق الأسرع نمواً',
      'home.faqTitle': 'الأسئلة الشائعة',
      'home.ctaTitle': 'هل أنت مستعد لبناء تواصل بريد إلكتروني أذكى؟',
      'home.ctaDesc': 'أطلق أول مسار أتمتة خلال دقائق معدودة مع بيئة العرض التفاعلية الكاملة.',
      'features.heroTitle': 'مصمم للسرعة والدقة ومعدل الوصول العالي.',
      'features.heroDesc': 'كل ميزة في MailFlow مصممة بواجهة مخصصة — من محرر البريد بالسحب والإفلات إلى مسارات الأتمتة المتفرعة.',
      'home2.heroTitle': 'أتمت الإيرادات، لا الأعمال الروتينية.',
      'home2.heroDesc': 'اجمع بين رحلات العملاء البصرية والمُشغّلات الفورية للسلوك، في تجربة حديثة مصممة لفرق التسويق عالية النمو.',
      'about.heroTitle': 'نبني محرك البريد الإلكتروني الأكثر ذكاءً لعام 2026.',
      'about.heroDesc': 'تأسست MailFlow لمنح المسوّقين ومؤسسي الشركات منصة هادئة وموثوقة تجمع بين هندسة وصول البريد والأتمتة البصرية.',
      'services.heroTitle': 'استراتيجيات احترافية للوصول والأتمتة عند الطلب.',
      'services.heroDesc': 'ادمج منصة MailFlow مع خدمات الترحيل، وتهيئة عناوين IP، وتصميم قوالب RTL المخصصة بإشراف خبرائنا.',
      'pricing.heroTitle': 'خطط أسعار واضحة تنمو مع جمهورك.',
      'pricing.heroDesc': 'ابدأ مجاناً بالأتمتة الأساسية، وقم بالترقية عندما تحتاج إلى سعة إرسال أعلى واختبارات A/B متقدمة.',
      'pricing.monthly': 'شهري',
      'pricing.yearly': 'سنوي (وفر 20%)',
      'pricing.recommended': 'الأكثر اختياراً',
      'auth.loginTitle': 'مرحباً بعودتك إلى MailFlow',
      'auth.loginSubtitle': 'سجّل الدخول للوصول إلى لوحة تحكم المسوّق',
      'auth.registerTitle': 'أنشئ حسابك في MailFlow',
      'auth.registerSubtitle': 'ابدأ أتمتة رحلات عملائك خلال دقائق',
      'dash.overview': 'نظرة عامة',
      'dash.campaigns': 'الحملات',
      'dash.builder': 'محرر البريد',
      'dash.contacts': 'جهات الاتصال',
      'dash.segments': 'الشرائح',
      'dash.automation': 'الأتمتة',
      'dash.templates': 'القوالب',
      'dash.analytics': 'التحليلات',
      'dash.integrations': 'التكاملات',
      'dash.settings': 'الإعدادات',
      'dash.logout': 'تسجيل الخروج',
      'dash.demoBanner': 'وضع العرض التجريبي — تُحفظ التعديلات محلياً في المتصفح ولا يتم إرسال رسائل حقيقية أو مدفوعات.',
      'footer.newsletterTitle': 'ابقَ على اطلاع بأحدث استراتيجيات البريد',
      'footer.newsletterBtn': 'اشترك',
      'footer.copyright': '© 2026 MailFlow SaaS. عرض تفاعلي لمنتج برمجي.'
    }
  };

  function translate(key, fallback) {
    const state = window.MailFlowStore ? window.MailFlowStore.getState() : { lang: 'en' };
    const lang = state.lang === 'ar' ? 'ar' : 'en';
    return (DICTIONARY[lang] && DICTIONARY[lang][key]) || (DICTIONARY.en && DICTIONARY.en[key]) || fallback || key;
  }

  function applyTranslations(root) {
    const scope = root || document;
    const nodes = scope.querySelectorAll('[data-i18n]');
    nodes.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = translate(key);
      if (val && val !== key) {
        el.textContent = val;
      }
    });
    const attrNodes = scope.querySelectorAll('[data-i18n-placeholder]');
    attrNodes.forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = translate(key);
      if (val && val !== key) {
        el.setAttribute('placeholder', val);
      }
    });
  }

  window.MailFlowI18n = {
    t: translate,
    apply: applyTranslations,
    dictionary: DICTIONARY
  };
})(window);

