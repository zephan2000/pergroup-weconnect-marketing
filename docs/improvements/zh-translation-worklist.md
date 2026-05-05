# ZH Translation Worklist

**Generated:** 2026-05-05 — post Phase 5 migration
**Purpose:** Single source of truth for every text rendered on the website. Use this as a translation checklist AND as the schema design reference for moving everything into CMS.

## How to read this doc

Each table represents one logical group of strings (e.g. nav, footer, a block). Columns:

| Column | Meaning |
|---|---|
| Path | Where the string lives today (CMS field path OR code dictionary key OR hardcoded) |
| Source | `CMS-localized` / `CMS-legacy-companion` / `Dictionary` / `Hardcoded-array` / `Hardcoded-inline` |
| EN value | Current English text |
| ZH value | Current Chinese text — `(MISSING)` if empty in CMS, `(needs translation)` if not yet translated |
| Target CMS field | Where it SHOULD live after refactor (proposed Payload field path) |
| Notes | Migration considerations |

---

## 1. Nav (currently in Dictionary)

Source: `src/lib/i18n/strings.ts` → `nav.*`

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `nav.philosophy` | Dictionary | Philosophy | 理念 | `NavSettings.linkPhilosophy` (localized) | |
| `nav.about` | Dictionary | About | 关于我们 | `NavSettings.linkAbout` | |
| `nav.services` | Dictionary | Services | 服务 | `NavSettings.linkServices` | |
| `nav.partners` | Dictionary | Partners | 合作伙伴 | `NavSettings.linkPartners` | |
| `nav.weconnect` | Dictionary | WeConnect ✦ | WeConnect ✦ | `NavSettings.linkWeConnect` | Brand mark — same in both |
| `nav.weconnectCta` | Dictionary | WECONNECT PLATFORM → | WECONNECT 平台 → | `NavSettings.ctaWeConnect` | |
| `languageToggle.ariaLabel` | Dictionary | Switch language | 切换语言 | `NavSettings.toggleAriaLabel` | A11y label |

---

## 2. Footer (currently in Dictionary)

Source: `src/lib/i18n/strings.ts` → `footer.*`

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `footer.tagline` | Dictionary | A globalized tech innovation ecosystem. | 全球化的科技创新生态平台。 | `FooterSettings.tagline` | |
| `footer.mission` | Dictionary | Making innovation open to anyone, anywhere. | 让创新对任何人、任何地方开放。 | `FooterSettings.mission` | |
| `footer.copyright` | Dictionary | © 2026 E-Harbor / PER GROUP · Singapore | © 2026 E-Harbor / PER GROUP · 新加坡 | `FooterSettings.copyright` | |
| `footer.eHarborTag` | Dictionary | by E-Harbor | E-Harbor 出品 | `FooterSettings.eHarborTag` | AI-LOW-CONF — review wording |
| `footer.eHarborTagCn` | Dictionary | e创码头 | e创码头 | `FooterSettings.eHarborSubBrand` | Brand sub-mark, same in both |
| `footer.pillarLine` | Dictionary | 科技创新 · 商业赋能 · 人文关怀 | 科技创新 · 商业赋能 · 人文关怀 | `FooterSettings.brandPillars` | Brand pillars, kept Chinese in both per design intent |
| (hardcoded section labels) | Hardcoded-inline `Footer.tsx` | Platform · 平台, Services · 服务, Philosophy · 价值观 | (mixed) | `FooterSettings.linkSections[]` | Currently rendered as mixed strings; needs splitting |

---

## 3. Hero block (currently CMS-localized + Dictionary)

Source: `src/payload/blocks/HeroBlock.ts` (already in CMS) + `strings.ts` → `hero.*`

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `pages_blocks_hero_locales.eyebrow` | CMS-localized | Global Tech Innovation Ecosystem · 全球科技创新生态平台 | **(MISSING)** | (current) | Mixed string in EN — split: EN = "Global Tech Innovation Ecosystem", ZH = "全球科技创新生态平台" |
| `pages_blocks_hero_locales.headline` | CMS-localized | Make Innovation | **(MISSING)** | (current) | Need ZH translation, e.g. "让创新" |
| `pages_blocks_hero_locales.headline_accent` | CMS-localized | Open to Anyone, | **(MISSING)** | (current) | Need ZH, e.g. "对任何人开放，" |
| `pages_blocks_hero_locales.headline_faint` | CMS-localized | Anywhere. | **(MISSING)** | (current) | Need ZH, e.g. "任何地方。" |
| `pages_blocks_hero_locales.subtitle` | CMS-localized | (empty) | 科技创新 · 商业赋能 · 人文关怀 | (current) | Migrated from legacy `chineseSubtitle` ✓ |
| `chineseSubtitle` (legacy companion) | CMS-legacy | (n/a) | 科技创新 · 商业赋能 · 人文关怀 | DROP after subtitle.zh confirmed | Same data as subtitle.zh — companion can retire |
| `hero.scrollHint` | Dictionary | SCROLL | 向下滚动 | `HeroBlock.scrollHintLabel` (localized) OR keep in dict | Tiny — could stay |
| Stats `[0].number` | CMS | 15+ | 15+ | (current) | Numeric, no translation |
| Stats `[0].label` (en) | CMS-localized | Years Global Experience | 全球产业链 · 创新链 ✓ | (current) | Done — but ZH text is questionable, "Years Global Experience" → expected "全球经验年数" |
| Stats `[1].label` | CMS-localized | Projects Worldwide | 全球项目经验 ✓ | (current) | Done |
| Stats `[2].label` | CMS-localized | Countries | 国家 ✓ | (current) | Done |
| Stats `[3].label` | CMS-localized | Partners | 创新伙伴 ✓ | (current) | Done |
| CTA Button [0] `label` | CMS-localized | Discover More | **(MISSING)** | (current) | Need ZH, e.g. "了解更多" |
| CTA Button [1] `label` | CMS-localized | WeConnect Platform → | **(MISSING)** | (current) | Need ZH, e.g. "WeConnect 平台 →" |

---

## 4. Values block (currently CMS-localized)

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `pages_blocks_values_locales.section_label` | CMS-localized | Our Philosophy · 我们的哲学 | **(MISSING)** | (current) | Mixed — split: EN "Our Philosophy", ZH "我们的哲学" |
| `pages_blocks_values_locales.headline` | CMS-localized | Core Philosophy | 四和五一 ✓ | (current) | Done (但 ZH-headline IS a Chinese phrase, not translation — by design) |
| `chineseHeadline` (legacy companion) | CMS-legacy | (n/a) | 四和五一 | DROP after migration | |
| Four Harmonies items, decorative `chinese` | CMS (NOT localized) | 心, 家, 社, 世 | (same — decorative) | Keep | Brand calligraphy, NOT translated |
| Four Harmonies items `english` (en) | CMS-localized | Awakening Heart, Harmonious Society, Amicable Family, Peaceful World | **(MISSING)** | (current) | Need ZH for each: 心灵的平和, 社会的和谐, 家庭的和睦, 世界的和平 |
| Five Unities items decorative `chinese` | CMS (NOT localized) | 易, 医, 爱, 艺, 义 | (same) | Keep | Brand calligraphy |
| Five Unities items `english` (en) | CMS-localized | Changes, Healthy, Love, Art, Morality | **(MISSING)** | (current) | Need ZH translations |
| Mottos `[0].label` | CMS-localized | VALUES · 价值观 | **(MISSING)** | (current) | Mixed — split |
| Mottos `[0].english` | CMS-localized | Joy · Peace · Justice | **(MISSING)** | (current) | Need ZH |
| Mottos `[0].chinese` (decorative) | CMS (NOT localized) | 喜乐，和平，公义 | (same) | Keep | Brand calligraphy |
| Mottos `[1].label` | CMS-localized | VISION · 愿景 | **(MISSING)** | (current) | Mixed — split |
| Mottos `[1].english` | CMS-localized | Business as a vehicle for values | **(MISSING)** | (current) | |
| Mottos `[1].chinese` | CMS (NOT localized) | 以商载道，共创共生 | (same) | Keep | |
| Mottos `[2].label` | CMS-localized | MISSION · 使命 | **(MISSING)** | (current) | Mixed — split |
| Mottos `[2].english` | CMS-localized | Where commerce is greatest, so too should be goodwill | **(MISSING)** | (current) | |
| Mottos `[2].chinese` | CMS (NOT localized) | 商业最集中的地方 也是善意最集中的地方 | (same) | Keep | |

---

## 5. About block (currently CMS-localized + Hardcoded array)

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `pages_blocks_about_locales.section_label` | CMS-localized | Who We Are · 我们是谁 | **(MISSING)** | (current) | Mixed — split |
| `pages_blocks_about_locales.headline` | CMS-localized | A Network Built on | **(MISSING)** | (current) | |
| `pages_blocks_about_locales.headline_accent` | CMS-localized | Genuine Trust | **(MISSING)** | (current) | |
| `pages_blocks_about_locales.body` (richText) | CMS-localized | (long English) | **(MISSING)** | (current) | Body copy needs translation |
| `pages_blocks_about_locales.globe_stat_label` | CMS-localized | COUNTRIES | **(MISSING)** | (current) | e.g. "国家" |
| `globeStat.number` | CMS | 53+ | 53+ | (current) | Numeric |
| Advantages `[*].title` (en) | CMS-localized | Multi-Dimensional Global View, Bicultural Service Network, Ethics & Compliance, Full-Journey Support | **(MISSING)** | (current) | Need ZH for all 4 |
| Advantages `[*].description` (en) | CMS-localized | (Chinese already filled in EN locale!) 真知 + 多维度全球视野, 华人和当地人一起服务, 职业操守和合规 · 高透明度, 从构想到决策，全程陪伴 | **(MISSING)** | (current) | Bug: EN fields contain Chinese. Need to fill ENGLISH translation in EN locale, then add ZH locale to keep current Chinese |
| Timeline `milestones[]` | **Hardcoded-array** in `AboutBlock.tsx` | 2009 Founded in Singapore, 2015 Expanded to 20+ countries, 2019 E-Harbor ecosystem launched, 2024 WeConnect AI platform | (hardcoded ZH) 新加坡成立, 拓展至20+国家, E-Harbor生态平台启动, WeConnect智能平台上线 | **NEW: AboutBlock.milestones[]** array field with `year` (text, not localized), `title` (localized) | **MOVE TO CMS** — pre-populate with current values |

---

## 6. Services block (currently CMS-localized)

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `pages_blocks_services_locales.section_label` | CMS-localized | What We Do · 服务内容 | **(MISSING)** | (current) | Mixed — split |
| `pages_blocks_services_locales.headline` | CMS-localized | End-to-End | **(MISSING)** | (current) | |
| `pages_blocks_services_locales.headline_accent` | CMS-localized | Global Services | **(MISSING)** | (current) | |
| Services `[*].title` (en) | CMS-localized | Market Intelligence, Location & Setup, Operations & HR, IP Standards & Compliance, Green & ESG, Innovation & Acceleration | (CHINESE PHRASE in zh locale ✓) 洞悉环境 · 商业设计, 选址服务 · 企业落地, 运营实施 · 人力资源, 知识产权 · 标准合规, 绿色动力 · 双碳平台, 科技创新 · 全球加速器 | (current) | Done ✓ |
| Services `[*].chineseTitle` (legacy) | CMS-legacy | (n/a) | (same as above ZH) | DROP after migration | |
| Services `[*].description` (en) | CMS-localized | (English description for each) | **(MISSING)** | (current) | Need ZH translations for all 6 |
| (hardcoded subtitle) `全方位全球化服务` | **Hardcoded-inline** `ServicesBlock.tsx:51` | (rendered always) | (same) | **NEW: ServicesBlock.subtitle** (localized) | **MOVE TO CMS** — pre-populate |

---

## 7. Clients (Partners) block (currently CMS-localized for clients + Hardcoded for partner types/regions)

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `clients[].name` | CMS | TCL, BAIDU 百度, MIDEA 美的, etc. | (same) | (current) | Brand names; bilingual on purpose |
| (hardcoded) Section subtitle `遍布全球的合作伙伴网络` | **Hardcoded-inline** `ClientsBlock.tsx:71` | (rendered always) | (same) | **NEW: ClientsBlock.networkSubtitle** (localized) | **MOVE TO CMS** |
| (hardcoded) Regional Presence heading `区域覆盖` | **Hardcoded-inline** `ClientsBlock.tsx:95` | (rendered always) | (same) | **NEW: ClientsBlock.regionsHeading** (localized) | **MOVE TO CMS** |
| (hardcoded) `partnerTypes[]` array | **Hardcoded-array** `ClientsBlock.tsx` | Government & Trade Bodies, Industry Associations, Professional Services, Innovation Ecosystem (with EN+CN+examples) | (mixed CN in array) | **NEW: ClientsBlock.partnerTypes[]** with `title` (localized), `examples` (localized), `icon` (text) | **MOVE TO CMS** — 4 items × 3 fields × 2 locales = 24 values |
| (hardcoded) `regions[]` array | **Hardcoded-array** `ClientsBlock.tsx` | Southeast Asia 80+, Europe 45+, North America 30+, Middle East 20+, Africa 15+, Oceania 10+ | (CN in array) 东南亚, 欧洲, 北美, 中东, 非洲, 大洋洲 | **NEW: ClientsBlock.regions[]** with `name` (localized), `count` (text, not localized) | **MOVE TO CMS** — 6 items × 1 localized field × 2 locales = 12 values |

---

## 8. PlatformTeaser block (currently CMS-localized)

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `pages_blocks_platform_teaser_locales.section_label` | CMS-localized | New Platform · 全新平台 | **(MISSING)** | (current) | Mixed — split |
| `pages_blocks_platform_teaser_locales.headline` | CMS-localized | WeConnect — | **(MISSING)** | (current) | |
| `pages_blocks_platform_teaser_locales.headline_accent` | CMS-localized | Global Demand & Supply Platform | **(MISSING)** | (current) | |
| `pages_blocks_platform_teaser_locales.body` (richText) | CMS-localized | (long English) | **(MISSING)** | (current) | |
| `pages_blocks_platform_teaser_locales.launch_cta_label` | CMS-localized | Launch WeConnect Platform → | **(MISSING)** | (current) | e.g. "进入 WeConnect 平台 →" |
| Features `[0].title` (en) | CMS-localized | Spaces — Offices, Labs, Factories · 办公室/实验室/厂房 | **(MISSING)** | (current) | Mixed — split |
| Features `[0].description` (en) | CMS-localized | Global space matching: Singapore, SEA, China, EU, Middle East | **(MISSING)** | (current) | |
| Features `[1].title` | CMS-localized | Funding & Investment · 融资对接 | **(MISSING)** | (current) | Mixed — split |
| Features `[1].description` | CMS-localized | VC, CVC, government grants — matched by stage and sector | **(MISSING)** | (current) | |
| Features `[2].title` | CMS-localized | AI Intelligent Matching · AI智能匹配 | **(MISSING)** | (current) | Mixed — split |
| Features `[2].description` | CMS-localized | Describe needs in plain language — AI finds the best partners instantly | **(MISSING)** | (current) | |

---

## 9. WeConnect overlay (currently in Dictionary)

Source: `src/lib/i18n/strings.ts` → `weconnect.*`

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `weconnect.tabNeeds` | Dictionary | Needs | 需求 | `WeConnectSettings.tabNeeds` (localized) | |
| `weconnect.tabAlerts` | Dictionary | Alerts | 资讯 | `WeConnectSettings.tabAlerts` | |
| `weconnect.tabProfile` | Dictionary | Profile | 我的 | `WeConnectSettings.tabProfile` | |
| `weconnect.postNeed` | Dictionary | Post a Need | 发布需求 | `WeConnectSettings.postNeedHeading` | |
| `weconnect.shareOffering` | Dictionary | Share What You Offer | 分享您的能力 | `WeConnectSettings.shareOfferingHeading` | |
| `weconnect.postNeedDescription` | Dictionary | Tell us what you're looking for. | 告诉我们您在寻找什么。 | `WeConnectSettings.postNeedDescription` | |
| `weconnect.shareOfferingDescription` | Dictionary | Let us know your capabilities. | 让我们了解您的能力。 | `WeConnectSettings.shareOfferingDescription` | |
| `weconnect.previewLabel` | Dictionary | Preview | 示例预览 | `WeConnectSettings.previewLabel` | |
| `weconnect.comingSoonLabel` | Dictionary | Coming Soon | 即将上线 | `WeConnectSettings.comingSoonLabel` | |
| `weconnect.recentNeeds` | Dictionary | Recent Needs | 最新需求 | `WeConnectSettings.recentNeedsHeading` | |
| `weconnect.advisoryAlerts` | Dictionary | Advisory Alerts | 顾问预警 | `WeConnectSettings.advisoryAlertsHeading` | |
| `weconnect.profileMember` | Dictionary | PER GROUP Enterprise | PER GROUP 企业会员 | `WeConnectSettings.profileMember` | |
| `weconnect.profileMemberSince` | Dictionary | E-Harbor Member since 2024 | E-Harbor会员，2024年起 | `WeConnectSettings.profileMemberSince` | |
| `weconnect.myPosts` | Dictionary | My Posts | 我的发布 | `WeConnectSettings.myPostsHeading` | |
| `weconnect.companyProfile` | Dictionary | Company Profile | 公司档案 | `WeConnectSettings.companyProfileHeading` | |
| `weconnect.settingsHeading` | Dictionary | Settings | 设置 | `WeConnectSettings.settingsHeading` | |
| `weconnect.settingLanguage` | Dictionary | Language | 语言 | `WeConnectSettings.settingLanguage` | |
| `weconnect.settingNotifications` | Dictionary | Notification preferences | 通知设置 | `WeConnectSettings.settingNotifications` | |
| `weconnect.settingContactPg` | Dictionary | Contact PER GROUP | 联系 PER GROUP | `WeConnectSettings.settingContactPg` | |
| `weconnect.settingAbout` | Dictionary | About WeConnect | 关于 WeConnect | `WeConnectSettings.settingAbout` | |
| `weconnect.enterpriseUser` | Dictionary | PER GROUP User | PER GROUP 用户 | `WeConnectSettings.enterpriseUser` | |
| `weconnect.enterpriseRole` | Dictionary | Enterprise Member | 企业会员 | `WeConnectSettings.enterpriseRole` | |

---

## 10. PostRequirementModal (currently in Dictionary + Hardcoded inline)

Source: `src/lib/i18n/strings.ts` → `forms.*` AND hardcoded in `PostRequirementModal.tsx`. Plus existing CMS in `PlatformSettings`.

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `requirementModalHeading` | CMS-existing PlatformSettings | Post a Requirement · 发布需求 | **(MISSING)** | `RequirementFormSettings.heading` (localized) | Mixed string — split |
| `requirementModalDescription` | CMS-existing PlatformSettings | Tell the WeConnect network what you need | **(MISSING)** | `RequirementFormSettings.description` (localized) | |
| `forms.requiredHint` | Dictionary | Required fields are marked with | 必填项标记为 | `RequirementFormSettings.requiredHint` | |
| `forms.sectionBasic` | Dictionary | Basic Information | 基本信息 | `RequirementFormSettings.sectionBasic` | |
| `forms.sectionRequirement` | Dictionary | Requirement Details | 需求详情 | `RequirementFormSettings.sectionRequirement` | |
| `forms.sectionCommercial` | Dictionary | Commercial Parameters | 商业参数 | `RequirementFormSettings.sectionCommercial` | |
| `forms.sectionContact` | Dictionary | Contact Information | 联系方式 | `RequirementFormSettings.sectionContact` | |
| `forms.labelSubject` | Dictionary | Subject | 主题 | `RequirementFormSettings.labelSubject` | |
| `forms.labelInquiryType` | Dictionary | Inquiry Type | 需求类型 | `RequirementFormSettings.labelInquiryType` | |
| `forms.labelDescription` | Dictionary | Description | 需求描述 | `RequirementFormSettings.labelDescription` | |
| `forms.labelGoal` | Dictionary | Goal / Objective | 目标 | `RequirementFormSettings.labelGoal` | |
| `forms.labelTargetLocation` | Dictionary | Target Location | 目标地区 | `RequirementFormSettings.labelTargetLocation` | |
| `forms.labelBudget` | Dictionary | Budget | 预算 | `RequirementFormSettings.labelBudget` | |
| `forms.labelTimeline` | Dictionary | Timeline | 时间 | `RequirementFormSettings.labelTimeline` | |
| `forms.labelFullName` | Dictionary | Full Name | 姓名 | `RequirementFormSettings.labelFullName` | |
| `forms.labelJobTitle` | Dictionary | Job Title | 职位 | `RequirementFormSettings.labelJobTitle` | |
| `forms.labelCompany` | Dictionary | Company | 公司 | `RequirementFormSettings.labelCompany` | |
| `forms.labelEmail` | Dictionary | Email | 邮箱 | `RequirementFormSettings.labelEmail` | |
| `forms.labelPhone` | Dictionary | Phone | 电话 | `RequirementFormSettings.labelPhone` | |
| `forms.labelMessage` | Dictionary | Message | 留言 | `RequirementFormSettings.labelMessage` | |
| `forms.placeholderSubject` | Dictionary | Brief title for your inquiry | 简要描述您的需求 | `RequirementFormSettings.placeholderSubject` | |
| `forms.placeholderDescription` | Dictionary | Describe what you're looking for | 详细描述您的需求 | `RequirementFormSettings.placeholderDescription` | |
| `forms.placeholderGoal` | Dictionary | What does success look like? | 您希望达成什么目标? | `RequirementFormSettings.placeholderGoal` | |
| `forms.placeholderTargetLocation` | Dictionary | e.g. Singapore, Vietnam, EU | 例如：新加坡、越南、欧盟 | `RequirementFormSettings.placeholderTargetLocation` | |
| `forms.placeholderBudget` | Dictionary | e.g. SGD 5k–15k/mo | 例如：每月新币5千至1万5 | `RequirementFormSettings.placeholderBudget` | AI-LOW-CONF |
| `forms.placeholderName` | Dictionary | Your name | 您的姓名 | `RequirementFormSettings.placeholderName` | |
| `forms.placeholderTitle` | Dictionary | e.g. Director | 职位 | `RequirementFormSettings.placeholderTitle` | |
| `forms.placeholderCompany` | Dictionary | Company name | 公司名称 | `RequirementFormSettings.placeholderCompany` | |
| `forms.placeholderEmail` | Dictionary | your@email.com | your@email.com | `RequirementFormSettings.placeholderEmail` | Same in both |
| `forms.placeholderPhone` | Dictionary | +65 xxxx xxxx | +65 xxxx xxxx | `RequirementFormSettings.placeholderPhone` | Same in both |
| `forms.placeholderMessage` | Dictionary | Tell us a bit about what you're looking for | 简述需求 | `RequirementFormSettings.placeholderMessage` | |
| `forms.buttonSubmit` | Dictionary | Submit Requirement | 提交需求 | `RequirementFormSettings.buttonSubmit` | |
| `forms.buttonSubmitting` | Dictionary | Submitting… | 提交中… | `RequirementFormSettings.buttonSubmitting` | |
| `forms.buttonSendIntro` | Dictionary | Send Introduction | 发送介绍 | `RequirementFormSettings.buttonSendIntro` | (used in SpaceDetailModal) |
| `forms.successTitleRequirement` | Dictionary | Got it — we'll be in touch. | 已收到 — 我们会尽快与您联系。 | `RequirementFormSettings.successTitle` | |
| `forms.successMessageRequirement` | Dictionary | PER GROUP will respond within 1 business day. | PER GROUP将在1个工作日内回复您。 | `RequirementFormSettings.successMessage` | |
| `forms.responseSla` | Dictionary | PER GROUP will respond within 1 business day | PER GROUP将在1个工作日内回复 | `RequirementFormSettings.responseSla` | (footer of form) |
| `forms.errorRequired` | Dictionary | Required | 必填 | `RequirementFormSettings.errorRequired` | |
| `forms.errorInvalidEmail` | Dictionary | Invalid email | 邮箱格式错误 | `RequirementFormSettings.errorInvalidEmail` | |
| `forms.errorGeneric` | Dictionary | Please fill in the required fields. | 请填写所有必填字段。 | `RequirementFormSettings.errorGeneric` | |
| `forms.timelineSelect` | Dictionary | Select timeline | 选择时间 | `RequirementFormSettings.timelineSelect` | |
| `forms.timelineUrgent` | Dictionary | ⚡ Urgent (< 2 weeks) | ⚡ 紧急（2周内） | `RequirementFormSettings.timelineOptions[0].label` | Better: array of options with `value` (not localized) + `label` (localized) |
| `forms.timelineThisQuarter` | Dictionary | 📅 This Quarter | 📅 本季度 | `RequirementFormSettings.timelineOptions[1].label` | |
| `forms.timeline3to6` | Dictionary | 📆 3–6 Months | 📆 3-6个月 | `RequirementFormSettings.timelineOptions[2].label` | |
| `forms.timelineExploring` | Dictionary | 🔍 Just Exploring | 🔍 初步了解 | `RequirementFormSettings.timelineOptions[3].label` | |
| `forms.typeOffice` | Dictionary | 🏢 Office Space | 🏢 办公室 | `RequirementFormSettings.typeOptions[0].label` | |
| `forms.typeLab` | Dictionary | 🔬 Lab / R&D Space | 🔬 实验室 | `RequirementFormSettings.typeOptions[1].label` | |
| `forms.typeFactory` | Dictionary | 🏭 Factory / Industrial Land | 🏭 厂房/工业用地 | `RequirementFormSettings.typeOptions[2].label` | |
| `forms.typeFunding` | Dictionary | 💰 Investment / Funding | 💰 投资/融资 | `RequirementFormSettings.typeOptions[3].label` | |
| `forms.typeMarketEntry` | Dictionary | 🌏 Market Entry Partner | 🌏 市场进入合作 | `RequirementFormSettings.typeOptions[4].label` | |
| `forms.typeOther` | Dictionary | 📋 Other | 📋 其他 | `RequirementFormSettings.typeOptions[5].label` | |

---

## 11. SpaceDetailModal (currently CMS-existing PlatformSettings + dictionary)

Source: existing `PlatformSettings` global + `strings.ts` → `forms.*`

| Path | Source | EN | ZH | Target CMS field | Notes |
|---|---|---|---|---|---|
| `contactModalHeading` | CMS-existing PlatformSettings | Connect with this partner · 联系合作方 | **(MISSING)** | `ContactFormSettings.heading` (localized) | Mixed — split |
| `contactModalSuccessTitle` | CMS-existing | Introduction Sent! | **(MISSING)** | `ContactFormSettings.successTitle` | |
| `contactModalSuccessMessage` | CMS-existing | WeConnect will facilitate the connection within 1–2 business days. · 已发送，1-2个工作日内回复。 | **(MISSING)** | `ContactFormSettings.successMessage` | Mixed — split |
| `detailLabelSize` | CMS-existing | Size | **(MISSING)** | `ContactFormSettings.detailSizeLabel` | |
| `detailLabelZone` | CMS-existing | Zone | **(MISSING)** | `ContactFormSettings.detailZoneLabel` | |
| `detailLabelSetup` | CMS-existing | Setup | **(MISSING)** | `ContactFormSettings.detailSetupLabel` | |
| `detailLabelLease` | CMS-existing | Lease | **(MISSING)** | `ContactFormSettings.detailLeaseLabel` | |
| `detailLabelPrice` | CMS-existing | Price | **(MISSING)** | `ContactFormSettings.detailPriceLabel` | |

---

## Summary by category

| Category | Count |
|---|---|
| ⚠️ **CMS fields with EN populated, ZH MISSING** (need translation) | 53 |
| ⚠️ **CMS fields with mixed EN+CN string in EN locale** (need split, then ZH) | ~12 |
| ⚠️ **Dictionary strings to MOVE to CMS** (~80 keys) | 80 |
| ⚠️ **Hardcoded arrays to MOVE to CMS** (milestones, partner types, regions) | 3 arrays / ~30 fields |
| ⚠️ **Hardcoded inline strings to MOVE to CMS** (subtitles in 3 components) | ~5 |
| ✅ **Decorative single Chinese characters** (心 家 易 etc.) — KEEP as-is | ~15 |
| ✅ **Brand names** (PER GROUP, E-Harbor, BAIDU 百度 etc.) — KEEP as-is | ~15 |
| ✅ **Already correctly translated** (services titles, hero stats labels) | 11 |

## Proposed CMS schema additions

**3 new globals:**
1. `NavSettings` — nav links + CTA + a11y
2. `FooterSettings` — tagline, mission, copyright, brand pillars
3. `RequirementFormSettings` — all form copy + dropdown options arrays
4. `ContactFormSettings` — extracted from current PlatformSettings (cleaner organization)
5. `WeConnectSettings` — overlay tabs + screen text

**3 new array fields on existing blocks:**
- `AboutBlock.milestones[]`
- `ClientsBlock.partnerTypes[]`
- `ClientsBlock.regions[]`

**1 new field on existing block:**
- `ServicesBlock.subtitle` (localized)
- `HeroBlock.scrollHintLabel` (localized) — optional

**Keeps existing PlatformSettings** — but `contactModalHeading`/etc. could move to new ContactFormSettings for cleaner organization (or stay).

---

## Workflow recommendation

1. **You review this worksheet** — confirm:
   - Categorization (especially Hero headline, Mottos `english`/`chinese` distinction)
   - Schema design (which globals, what to call them)
   - Whether to create new globals or extend PlatformSettings
2. **I generate Payload schema additions + migration**
   - Pre-populate every new field with the CURRENT EN/ZH values from the dictionary/hardcoded arrays
   - Migration is purely additive (CREATE TABLE, ADD COLUMN, INSERT) — zero data risk
3. **You verify in `/admin`** that you can see + edit each new field
4. **I refactor components** to read from CMS instead of dictionary/hardcoded
5. **You populate the 53 ZH-MISSING fields** + tweak any pre-populated values
6. **(Eventually)** Drop legacy `chinese*` companion fields once everything verified

---

## Open questions for you

1. **Mottos** — current schema has both `english` (now localized) AND `chinese` (decorative, NOT localized). Under ZH locale, should the `english` field be hidden (since `chinese` already conveys the message) or shown alongside? Current intent is bilingual display always.
2. **Hero headline** — when translated to ZH, the layout (`headline / headlineAccent / headlineFaint` 3-line block with amber accent) may not work well with a Chinese phrase. Is the design supposed to differ per locale, or do we constrain Chinese to fit the same 3-line structure?
3. **Form dropdown options** — current pattern is hardcoded array with `value` (English code) + `label` (localized text). For CMS, do you want admin to be able to add/remove options, or just rename existing labels? Adding new options means the API also has to handle them — so for now I'd freeze option `value`s and only let admin edit `label`s.
4. **Brand pillar line** `科技创新 · 商业赋能 · 人文关怀` — currently kept Chinese in BOTH locales as a brand mark. Stay that way?
