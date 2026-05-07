-- ═══════════════════════════════════════════════════════════════════════════
-- Seed: cms.offering_form_settings (parent + EN + ZH locale rows)
--
-- The OfferingForm Payload global was added to the schema (5b.4 follow-up)
-- but never populated with rows, so the admin sees blank fields and the
-- frontend falls back to DEFAULT_OFFERING_FORM_SETTINGS in
-- src/lib/cms/site-text.ts. This seeds both locales with the same
-- defaults, plus AI-drafted ZH translations.
--
-- Idempotent — re-runnable. ON CONFLICT DO UPDATE on the locales table
-- means subsequent runs refresh the values.
--
-- ZH translations are AI-drafted; owner refines as needed.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- 1. Parent row (Payload globals always have id=1).
INSERT INTO cms.offering_form_settings (id, created_at, updated_at)
VALUES (1, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- 2. EN locale row.
INSERT INTO cms.offering_form_settings_locales (
  _locale, _parent_id,
  heading, description, required_hint, response_sla,
  section_basic, section_capability, section_availability, section_contact,
  label_subject, label_category, label_capability, label_track_record, label_ideal_client,
  label_availability, label_coverage, label_capacity,
  label_full_name, label_job_title, label_company, label_email, label_phone,
  placeholder_subject, placeholder_capability, placeholder_track_record, placeholder_ideal_client,
  placeholder_coverage, placeholder_capacity,
  placeholder_name, placeholder_title, placeholder_company, placeholder_email, placeholder_phone,
  button_submit, button_submitting,
  success_title, success_message,
  error_required, error_invalid_email, error_generic,
  category_office_brokerage, category_lab_brokerage, category_factory_brokerage,
  category_advisory, category_market_entry, category_funding, category_other,
  availability_select, availability_immediate, availability_this_quarter,
  availability_next_quarter, availability_custom
)
VALUES (
  'en', 1,
  'Share What You Offer',
  'Tell the WeConnect network what you bring to the table',
  'Required fields are marked with',
  'PER GROUP will review and respond within 1 business day',
  'Basic Information', 'Capability', 'Availability & Coverage', 'Contact Information',
  'Subject', 'Offering Category', 'Capability Description', 'Track Record', 'Ideal Client',
  'Availability', 'Coverage Regions', 'Capacity / Lead Time',
  'Full Name', 'Job Title', 'Company', 'Email', 'Phone',
  'Brief title for your offering',
  'Describe what you do, how you deliver, and what sets you apart',
  'Notable clients, case studies, certifications',
  'e.g. growth-stage tech firms entering Asia',
  'e.g. Singapore, Greater Bay Area, ASEAN',
  'e.g. 2-week onboarding, 3 active engagements',
  'Your name', 'e.g. Director', 'Company name', 'your@email.com', '+65 xxxx xxxx',
  'Submit Offering', 'Submitting…',
  'Thanks — your offering is on file.',
  'PER GROUP will review and respond within 1 business day.',
  'Required', 'Invalid email', 'Please fill in the required fields.',
  '🏢 Office Brokerage', '🔬 Lab / R&D Brokerage', '🏭 Factory / Industrial Brokerage',
  '🧭 Advisory / Consulting', '🌏 Market Entry Services', '💰 Funding / Investment', '📋 Other',
  'Select availability', '⚡ Immediate', '📅 This Quarter',
  '📆 Next Quarter', '📝 Custom (see notes)'
)
ON CONFLICT (_locale, _parent_id) DO UPDATE SET
  heading = EXCLUDED.heading,
  description = EXCLUDED.description,
  required_hint = EXCLUDED.required_hint,
  response_sla = EXCLUDED.response_sla,
  section_basic = EXCLUDED.section_basic,
  section_capability = EXCLUDED.section_capability,
  section_availability = EXCLUDED.section_availability,
  section_contact = EXCLUDED.section_contact,
  label_subject = EXCLUDED.label_subject,
  label_category = EXCLUDED.label_category,
  label_capability = EXCLUDED.label_capability,
  label_track_record = EXCLUDED.label_track_record,
  label_ideal_client = EXCLUDED.label_ideal_client,
  label_availability = EXCLUDED.label_availability,
  label_coverage = EXCLUDED.label_coverage,
  label_capacity = EXCLUDED.label_capacity,
  label_full_name = EXCLUDED.label_full_name,
  label_job_title = EXCLUDED.label_job_title,
  label_company = EXCLUDED.label_company,
  label_email = EXCLUDED.label_email,
  label_phone = EXCLUDED.label_phone,
  placeholder_subject = EXCLUDED.placeholder_subject,
  placeholder_capability = EXCLUDED.placeholder_capability,
  placeholder_track_record = EXCLUDED.placeholder_track_record,
  placeholder_ideal_client = EXCLUDED.placeholder_ideal_client,
  placeholder_coverage = EXCLUDED.placeholder_coverage,
  placeholder_capacity = EXCLUDED.placeholder_capacity,
  placeholder_name = EXCLUDED.placeholder_name,
  placeholder_title = EXCLUDED.placeholder_title,
  placeholder_company = EXCLUDED.placeholder_company,
  placeholder_email = EXCLUDED.placeholder_email,
  placeholder_phone = EXCLUDED.placeholder_phone,
  button_submit = EXCLUDED.button_submit,
  button_submitting = EXCLUDED.button_submitting,
  success_title = EXCLUDED.success_title,
  success_message = EXCLUDED.success_message,
  error_required = EXCLUDED.error_required,
  error_invalid_email = EXCLUDED.error_invalid_email,
  error_generic = EXCLUDED.error_generic,
  category_office_brokerage = EXCLUDED.category_office_brokerage,
  category_lab_brokerage = EXCLUDED.category_lab_brokerage,
  category_factory_brokerage = EXCLUDED.category_factory_brokerage,
  category_advisory = EXCLUDED.category_advisory,
  category_market_entry = EXCLUDED.category_market_entry,
  category_funding = EXCLUDED.category_funding,
  category_other = EXCLUDED.category_other,
  availability_select = EXCLUDED.availability_select,
  availability_immediate = EXCLUDED.availability_immediate,
  availability_this_quarter = EXCLUDED.availability_this_quarter,
  availability_next_quarter = EXCLUDED.availability_next_quarter,
  availability_custom = EXCLUDED.availability_custom;

-- 3. ZH locale row — AI-drafted translations. Owner refines later as needed.
INSERT INTO cms.offering_form_settings_locales (
  _locale, _parent_id,
  heading, description, required_hint, response_sla,
  section_basic, section_capability, section_availability, section_contact,
  label_subject, label_category, label_capability, label_track_record, label_ideal_client,
  label_availability, label_coverage, label_capacity,
  label_full_name, label_job_title, label_company, label_email, label_phone,
  placeholder_subject, placeholder_capability, placeholder_track_record, placeholder_ideal_client,
  placeholder_coverage, placeholder_capacity,
  placeholder_name, placeholder_title, placeholder_company, placeholder_email, placeholder_phone,
  button_submit, button_submitting,
  success_title, success_message,
  error_required, error_invalid_email, error_generic,
  category_office_brokerage, category_lab_brokerage, category_factory_brokerage,
  category_advisory, category_market_entry, category_funding, category_other,
  availability_select, availability_immediate, availability_this_quarter,
  availability_next_quarter, availability_custom
)
VALUES (
  'zh', 1,
  '分享您的能力',
  '让 WeConnect 网络了解您能提供的服务',
  '必填项标记为',
  'PER GROUP 将在 1 个工作日内审核并回复',
  '基本信息', '能力描述', '可用性与覆盖范围', '联系方式',
  '主题', '服务类别', '能力描述', '过往业绩', '理想客户',
  '可用性', '覆盖区域', '产能 / 交付周期',
  '姓名', '职位', '公司', '邮箱', '电话',
  '简要描述您的服务',
  '描述您所做的工作、交付方式以及独特之处',
  '代表性客户、案例、认证',
  '例如：进入亚洲的成长期科技企业',
  '例如：新加坡、大湾区、东盟',
  '例如：2 周入场、3 个并行项目',
  '您的姓名', '例如：总监', '公司名称', 'your@email.com', '+65 xxxx xxxx',
  '提交服务', '提交中…',
  '感谢 — 您的服务已登记。',
  'PER GROUP 将在 1 个工作日内审核并回复。',
  '必填', '邮箱格式错误', '请填写所有必填字段。',
  '🏢 办公室经纪', '🔬 实验室经纪', '🏭 厂房经纪',
  '🧭 顾问咨询', '🌏 市场进入服务', '💰 投资 / 融资', '📋 其他',
  '选择可用性', '⚡ 立即', '📅 本季度',
  '📆 下季度', '📝 自定义（见备注）'
)
ON CONFLICT (_locale, _parent_id) DO UPDATE SET
  heading = EXCLUDED.heading,
  description = EXCLUDED.description,
  required_hint = EXCLUDED.required_hint,
  response_sla = EXCLUDED.response_sla,
  section_basic = EXCLUDED.section_basic,
  section_capability = EXCLUDED.section_capability,
  section_availability = EXCLUDED.section_availability,
  section_contact = EXCLUDED.section_contact,
  label_subject = EXCLUDED.label_subject,
  label_category = EXCLUDED.label_category,
  label_capability = EXCLUDED.label_capability,
  label_track_record = EXCLUDED.label_track_record,
  label_ideal_client = EXCLUDED.label_ideal_client,
  label_availability = EXCLUDED.label_availability,
  label_coverage = EXCLUDED.label_coverage,
  label_capacity = EXCLUDED.label_capacity,
  label_full_name = EXCLUDED.label_full_name,
  label_job_title = EXCLUDED.label_job_title,
  label_company = EXCLUDED.label_company,
  label_email = EXCLUDED.label_email,
  label_phone = EXCLUDED.label_phone,
  placeholder_subject = EXCLUDED.placeholder_subject,
  placeholder_capability = EXCLUDED.placeholder_capability,
  placeholder_track_record = EXCLUDED.placeholder_track_record,
  placeholder_ideal_client = EXCLUDED.placeholder_ideal_client,
  placeholder_coverage = EXCLUDED.placeholder_coverage,
  placeholder_capacity = EXCLUDED.placeholder_capacity,
  placeholder_name = EXCLUDED.placeholder_name,
  placeholder_title = EXCLUDED.placeholder_title,
  placeholder_company = EXCLUDED.placeholder_company,
  placeholder_email = EXCLUDED.placeholder_email,
  placeholder_phone = EXCLUDED.placeholder_phone,
  button_submit = EXCLUDED.button_submit,
  button_submitting = EXCLUDED.button_submitting,
  success_title = EXCLUDED.success_title,
  success_message = EXCLUDED.success_message,
  error_required = EXCLUDED.error_required,
  error_invalid_email = EXCLUDED.error_invalid_email,
  error_generic = EXCLUDED.error_generic,
  category_office_brokerage = EXCLUDED.category_office_brokerage,
  category_lab_brokerage = EXCLUDED.category_lab_brokerage,
  category_factory_brokerage = EXCLUDED.category_factory_brokerage,
  category_advisory = EXCLUDED.category_advisory,
  category_market_entry = EXCLUDED.category_market_entry,
  category_funding = EXCLUDED.category_funding,
  category_other = EXCLUDED.category_other,
  availability_select = EXCLUDED.availability_select,
  availability_immediate = EXCLUDED.availability_immediate,
  availability_this_quarter = EXCLUDED.availability_this_quarter,
  availability_next_quarter = EXCLUDED.availability_next_quarter,
  availability_custom = EXCLUDED.availability_custom;

COMMIT;
