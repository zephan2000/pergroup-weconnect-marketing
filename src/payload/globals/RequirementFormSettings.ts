/**
 * Payload global: Post a Need Form Settings.
 *
 * Note on naming: the slug `requirement-form-settings` is preserved for
 * backwards compatibility with existing CMS data, the API contract, and
 * Resend templates. The user-facing copy ("Post a Need") is what editors
 * and visitors see.
 *
 * All headings, labels, placeholders, button text, success/error messages,
 * dropdown OPTION LABELS (option `value` codes stay frozen in code).
 *
 * Lite-CMS pattern: admins edit visible labels. Adding/removing dropdown
 * options is deferred — those require a code+migration change because the
 * API contract references option values.
 */
import type { GlobalConfig } from 'payload'

const t = (en: string, zh: string) => ({ en, zh })

export const RequirementFormSettings: GlobalConfig = {
  slug: 'requirement-form-settings',
  label: t('Need Form Settings', '需求表单设置'),
  // Drafts on: editors get Save Draft + Publish; production renders the
  // published version, Live Preview iframe renders the draft.
  versions: { drafts: true },
  fields: [
    {
      type: 'collapsible',
      label: t('Modal Header', '弹窗标题'),
      fields: [
        { name: 'heading', type: 'text', localized: true, label: t('Heading', '标题') },
        { name: 'description', type: 'text', localized: true, label: t('Description', '描述') },
        { name: 'requiredHint', type: 'text', localized: true, label: t('Required-fields hint', '必填项提示') },
        { name: 'responseSla', type: 'text', localized: true, label: t('Response SLA', '响应承诺') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Section Titles', '区块标题'),
      fields: [
        { name: 'sectionBasic', type: 'text', localized: true, label: t('Basic Information', '基本信息') },
        { name: 'sectionRequirement', type: 'text', localized: true, label: t('Need Details', '需求详情') },
        { name: 'sectionCommercial', type: 'text', localized: true, label: t('Commercial Parameters', '商业参数') },
        { name: 'sectionContact', type: 'text', localized: true, label: t('Contact Information', '联系方式') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Field Labels', '字段标签'),
      fields: [
        { name: 'labelSubject', type: 'text', localized: true, label: t('Subject', '主题') },
        { name: 'labelInquiryType', type: 'text', localized: true, label: t('Inquiry Type', '需求类型') },
        { name: 'labelDescription', type: 'text', localized: true, label: t('Description', '描述') },
        { name: 'labelGoal', type: 'text', localized: true, label: t('Goal / Objective', '目标') },
        { name: 'labelTargetLocation', type: 'text', localized: true, label: t('Target Location', '目标地区') },
        { name: 'labelBudget', type: 'text', localized: true, label: t('Budget', '预算') },
        { name: 'labelTimeline', type: 'text', localized: true, label: t('Timeline', '时间') },
        { name: 'labelFullName', type: 'text', localized: true, label: t('Full Name', '姓名') },
        { name: 'labelJobTitle', type: 'text', localized: true, label: t('Job Title', '职位') },
        { name: 'labelCompany', type: 'text', localized: true, label: t('Company', '公司') },
        { name: 'labelEmail', type: 'text', localized: true, label: t('Email', '邮箱') },
        { name: 'labelPhone', type: 'text', localized: true, label: t('Phone', '电话') },
        { name: 'labelMessage', type: 'text', localized: true, label: t('Message', '留言') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Placeholders', '占位文字'),
      fields: [
        { name: 'placeholderSubject', type: 'text', localized: true, label: t('Subject placeholder', '主题占位') },
        { name: 'placeholderDescription', type: 'text', localized: true, label: t('Description placeholder', '描述占位') },
        { name: 'placeholderGoal', type: 'text', localized: true, label: t('Goal placeholder', '目标占位') },
        { name: 'placeholderTargetLocation', type: 'text', localized: true, label: t('Target location placeholder', '地区占位') },
        { name: 'placeholderBudget', type: 'text', localized: true, label: t('Budget placeholder', '预算占位') },
        { name: 'placeholderName', type: 'text', localized: true, label: t('Name placeholder', '姓名占位') },
        { name: 'placeholderTitle', type: 'text', localized: true, label: t('Title placeholder', '职位占位') },
        { name: 'placeholderCompany', type: 'text', localized: true, label: t('Company placeholder', '公司占位') },
        { name: 'placeholderEmail', type: 'text', localized: true, label: t('Email placeholder', '邮箱占位') },
        { name: 'placeholderPhone', type: 'text', localized: true, label: t('Phone placeholder', '电话占位') },
        { name: 'placeholderMessage', type: 'text', localized: true, label: t('Message placeholder', '留言占位') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Buttons', '按钮文字'),
      fields: [
        { name: 'buttonSubmit', type: 'text', localized: true, label: t('Submit', '提交') },
        { name: 'buttonSubmitting', type: 'text', localized: true, label: t('Submitting…', '提交中…') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Success Screen', '成功提示'),
      fields: [
        { name: 'successTitle', type: 'text', localized: true, label: t('Success title', '成功标题') },
        { name: 'successMessage', type: 'text', localized: true, label: t('Success message', '成功消息') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Error Messages', '错误提示'),
      fields: [
        { name: 'errorRequired', type: 'text', localized: true, label: t('Required field error', '必填错误') },
        { name: 'errorInvalidEmail', type: 'text', localized: true, label: t('Invalid email', '邮箱错误') },
        { name: 'errorGeneric', type: 'text', localized: true, label: t('Generic error', '通用错误') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Inquiry Type Options', '需求类型选项'),
      admin: { description: t('Edit visible labels only. The internal "value" code is frozen.', '仅可修改显示标签，内部值代码固定。') },
      fields: [
        { name: 'typeOffice', type: 'text', localized: true, label: t('Office Space', '办公室') },
        { name: 'typeLab', type: 'text', localized: true, label: t('Lab / R&D', '实验室') },
        { name: 'typeFactory', type: 'text', localized: true, label: t('Factory / Industrial', '厂房/工业') },
        { name: 'typeFunding', type: 'text', localized: true, label: t('Investment / Funding', '投资/融资') },
        { name: 'typeMarketEntry', type: 'text', localized: true, label: t('Market Entry', '市场进入') },
        { name: 'typeOther', type: 'text', localized: true, label: t('Other', '其他') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Timeline Options', '时间选项'),
      fields: [
        { name: 'timelineSelect', type: 'text', localized: true, label: t('Select timeline (placeholder)', '选择时间（占位）') },
        { name: 'timelineUrgent', type: 'text', localized: true, label: t('Urgent', '紧急') },
        { name: 'timelineThisQuarter', type: 'text', localized: true, label: t('This Quarter', '本季度') },
        { name: 'timeline3to6', type: 'text', localized: true, label: t('3–6 Months', '3-6个月') },
        { name: 'timelineExploring', type: 'text', localized: true, label: t('Just Exploring', '初步了解') },
      ],
    },
  ],
}
