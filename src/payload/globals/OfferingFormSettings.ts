/**
 * Payload global: Share an Offering Form Settings.
 *
 * Supplier-side counterpart to the Need form. Lets editors maintain headings,
 * field labels, placeholders, dropdown option labels, success/error copy, and
 * the response SLA shown at the bottom of the modal.
 *
 * Lite-CMS pattern (mirrors RequirementFormSettings): only visible labels are
 * editable. Dropdown option `value` codes are frozen in the modal component
 * because the API/email contract references them.
 */
import type { GlobalConfig } from 'payload'

const t = (en: string, zh: string) => ({ en, zh })

export const OfferingFormSettings: GlobalConfig = {
  slug: 'offering-form-settings',
  label: t('Offering Form Settings', '能力分享表单设置'),
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
        { name: 'sectionCapability', type: 'text', localized: true, label: t('Capability', '能力描述') },
        { name: 'sectionAvailability', type: 'text', localized: true, label: t('Availability & Coverage', '可用性与覆盖') },
        { name: 'sectionContact', type: 'text', localized: true, label: t('Contact Information', '联系方式') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Field Labels', '字段标签'),
      fields: [
        { name: 'labelSubject', type: 'text', localized: true, label: t('Subject', '主题') },
        { name: 'labelCategory', type: 'text', localized: true, label: t('Offering Category', '能力类别') },
        { name: 'labelCapability', type: 'text', localized: true, label: t('Capability Description', '能力描述') },
        { name: 'labelTrackRecord', type: 'text', localized: true, label: t('Track Record', '过往业绩') },
        { name: 'labelIdealClient', type: 'text', localized: true, label: t('Ideal Client', '理想客户') },
        { name: 'labelAvailability', type: 'text', localized: true, label: t('Availability', '可用性') },
        { name: 'labelCoverage', type: 'text', localized: true, label: t('Coverage Regions', '覆盖地区') },
        { name: 'labelCapacity', type: 'text', localized: true, label: t('Capacity / Lead Time', '产能/交付周期') },
        { name: 'labelFullName', type: 'text', localized: true, label: t('Full Name', '姓名') },
        { name: 'labelJobTitle', type: 'text', localized: true, label: t('Job Title', '职位') },
        { name: 'labelCompany', type: 'text', localized: true, label: t('Company', '公司') },
        { name: 'labelEmail', type: 'text', localized: true, label: t('Email', '邮箱') },
        { name: 'labelPhone', type: 'text', localized: true, label: t('Phone', '电话') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Placeholders', '占位文字'),
      fields: [
        { name: 'placeholderSubject', type: 'text', localized: true, label: t('Subject placeholder', '主题占位') },
        { name: 'placeholderCapability', type: 'text', localized: true, label: t('Capability placeholder', '能力占位') },
        { name: 'placeholderTrackRecord', type: 'text', localized: true, label: t('Track record placeholder', '过往业绩占位') },
        { name: 'placeholderIdealClient', type: 'text', localized: true, label: t('Ideal client placeholder', '理想客户占位') },
        { name: 'placeholderCoverage', type: 'text', localized: true, label: t('Coverage placeholder', '覆盖占位') },
        { name: 'placeholderCapacity', type: 'text', localized: true, label: t('Capacity placeholder', '产能占位') },
        { name: 'placeholderName', type: 'text', localized: true, label: t('Name placeholder', '姓名占位') },
        { name: 'placeholderTitle', type: 'text', localized: true, label: t('Title placeholder', '职位占位') },
        { name: 'placeholderCompany', type: 'text', localized: true, label: t('Company placeholder', '公司占位') },
        { name: 'placeholderEmail', type: 'text', localized: true, label: t('Email placeholder', '邮箱占位') },
        { name: 'placeholderPhone', type: 'text', localized: true, label: t('Phone placeholder', '电话占位') },
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
      label: t('Offering Category Options', '能力类别选项'),
      admin: { description: t('Edit visible labels only. The internal "value" code is frozen.', '仅可修改显示标签，内部值代码固定。') },
      fields: [
        { name: 'categoryOfficeBrokerage', type: 'text', localized: true, label: t('Office Brokerage', '办公空间中介') },
        { name: 'categoryLabBrokerage', type: 'text', localized: true, label: t('Lab / R&D Brokerage', '实验室中介') },
        { name: 'categoryFactoryBrokerage', type: 'text', localized: true, label: t('Factory / Industrial Brokerage', '厂房/工业中介') },
        { name: 'categoryAdvisory', type: 'text', localized: true, label: t('Advisory / Consulting', '顾问/咨询') },
        { name: 'categoryMarketEntry', type: 'text', localized: true, label: t('Market Entry Services', '市场进入服务') },
        { name: 'categoryFunding', type: 'text', localized: true, label: t('Funding / Investment', '融资/投资') },
        { name: 'categoryOther', type: 'text', localized: true, label: t('Other', '其他') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Availability Options', '可用性选项'),
      fields: [
        { name: 'availabilitySelect', type: 'text', localized: true, label: t('Select availability (placeholder)', '选择可用性（占位）') },
        { name: 'availabilityImmediate', type: 'text', localized: true, label: t('Immediate', '立即可用') },
        { name: 'availabilityThisQuarter', type: 'text', localized: true, label: t('This Quarter', '本季度') },
        { name: 'availabilityNextQuarter', type: 'text', localized: true, label: t('Next Quarter', '下季度') },
        { name: 'availabilityCustom', type: 'text', localized: true, label: t('Custom (see notes)', '其他（详见说明）') },
      ],
    },
  ],
}
