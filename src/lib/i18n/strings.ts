/**
 * UI string dictionary for the EN/CN toggle.
 *
 * Hardcoded UI labels live here. CMS content uses Payload bilingual fields
 * (see docs/improvements/infrastructure/cms-i18n-migration.md).
 *
 * Translation accuracy must be reviewed by a native Mandarin speaker before
 * launch (TEAM_REVIEW item).
 *
 * Add new keys to BOTH `en` and `zh` to keep the dictionary in sync.
 */

export const strings = {
  en: {
    nav: {
      philosophy: 'Philosophy',
      about: 'About',
      services: 'Services',
      partners: 'Partners',
      weconnect: 'WeConnect',
      weconnectCta: 'WECONNECT PLATFORM →',
    },
    languageToggle: {
      en: 'EN',
      zh: '中文',
      ariaLabel: 'Switch language',
    },
    forms: {
      requiredHint: 'Required fields are marked with',
      requiredAsterisk: '*',
      sectionBasic: 'Basic Information',
      sectionRequirement: 'Requirement Details',
      sectionCommercial: 'Commercial Parameters',
      sectionContact: 'Contact Information',
      labelSubject: 'Subject',
      labelInquiryType: 'Inquiry Type',
      labelDescription: 'Description',
      labelGoal: 'Goal / Objective',
      labelTargetLocation: 'Target Location',
      labelBudget: 'Budget',
      labelTimeline: 'Timeline',
      labelFullName: 'Full Name',
      labelJobTitle: 'Job Title',
      labelCompany: 'Company',
      labelEmail: 'Email',
      labelPhone: 'Phone',
      buttonSubmit: 'Submit Requirement',
      buttonSubmitting: 'Submitting…',
      successTitle: 'Got it — we\'ll be in touch.',
      successMessage: 'PER GROUP will respond within 1 business day.',
      responseSla: 'PER GROUP will respond within 1 business day',
      errorRequired: 'Required',
      errorInvalidEmail: 'Invalid email',
      errorGeneric: 'Please fill in the required fields.',
    },
    weconnect: {
      tabNeeds: 'Needs',
      tabAlerts: 'Alerts',
      tabProfile: 'Profile',
      postNeed: 'Post a Need',
      shareOffering: 'Share What You Offer',
      postNeedDescription: 'Tell us what you\'re looking for.',
      shareOfferingDescription: 'Let us know your capabilities.',
    },
    footer: {
      tagline: 'A globalized tech innovation ecosystem.',
      mission: 'Making innovation open to anyone, anywhere.',
      copyright: '© 2026 E-Harbor / PER GROUP · Singapore',
    },
  },
  zh: {
    nav: {
      philosophy: '理念',
      about: '关于我们',
      services: '服务',
      partners: '合作伙伴',
      weconnect: 'WeConnect',
      weconnectCta: 'WECONNECT 平台 →',
    },
    languageToggle: {
      en: 'EN',
      zh: '中文',
      ariaLabel: '切换语言',
    },
    forms: {
      requiredHint: '必填项标记为',
      requiredAsterisk: '*',
      sectionBasic: '基本信息',
      sectionRequirement: '需求详情',
      sectionCommercial: '商业参数',
      sectionContact: '联系方式',
      labelSubject: '主题',
      labelInquiryType: '需求类型',
      labelDescription: '需求描述',
      labelGoal: '目标',
      labelTargetLocation: '目标地区',
      labelBudget: '预算',
      labelTimeline: '时间',
      labelFullName: '姓名',
      labelJobTitle: '职位',
      labelCompany: '公司',
      labelEmail: '邮箱',
      labelPhone: '电话',
      buttonSubmit: '提交需求',
      buttonSubmitting: '提交中…',
      successTitle: '已收到 — 我们会尽快与您联系。',
      successMessage: 'PER GROUP将在1个工作日内回复您。',
      responseSla: 'PER GROUP将在1个工作日内回复',
      errorRequired: '必填',
      errorInvalidEmail: '邮箱格式错误',
      errorGeneric: '请填写所有必填字段。',
    },
    weconnect: {
      tabNeeds: '需求',
      tabAlerts: '资讯',
      tabProfile: '我的',
      postNeed: '发布需求',
      shareOffering: '分享您的能力',
      postNeedDescription: '告诉我们您在寻找什么。',
      shareOfferingDescription: '让我们了解您的能力。',
    },
    footer: {
      tagline: '全球化的科技创新生态平台。',
      mission: '让创新对任何人、任何地方开放。',
      copyright: '© 2026 E-Harbor / PER GROUP · 新加坡',
    },
  },
} as const

export type Locale = keyof typeof strings
export type Strings = typeof strings.en
