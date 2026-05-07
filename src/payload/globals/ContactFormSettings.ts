/**
 * Payload global: Space Detail (Contact) Form Settings.
 * Heading + success messages + space-detail row labels.
 * Single-locale rendering — no EN+CN side-by-side strings.
 */
import type { GlobalConfig } from 'payload'

const t = (en: string, zh: string) => ({ en, zh })

export const ContactFormSettings: GlobalConfig = {
  slug: 'contact-form-settings',
  label: t('Contact Form Settings', '联系表单设置'),
  // Drafts on: editors get Save Draft + Publish; production renders the
  // published version, Live Preview iframe renders the draft.
  versions: { drafts: true },
  fields: [
    { name: 'heading', type: 'text', localized: true, label: t('Modal heading', '弹窗标题') },
    { name: 'successTitle', type: 'text', localized: true, label: t('Success title', '成功标题') },
    { name: 'successMessage', type: 'text', localized: true, label: t('Success message', '成功消息') },
    { name: 'buttonSendIntro', type: 'text', localized: true, label: t('Send Introduction button', '发送介绍按钮') },
    { name: 'buttonSending', type: 'text', localized: true, label: t('Sending… button', '发送中…按钮') },
    {
      type: 'collapsible',
      label: t('Space Detail Row Labels', '空间详情字段标签'),
      fields: [
        { name: 'detailLabelSize', type: 'text', localized: true, label: t('Size', '面积') },
        { name: 'detailLabelZone', type: 'text', localized: true, label: t('Zone', '区域') },
        { name: 'detailLabelSetup', type: 'text', localized: true, label: t('Setup', '设施') },
        { name: 'detailLabelLease', type: 'text', localized: true, label: t('Lease', '租期') },
        { name: 'detailLabelPrice', type: 'text', localized: true, label: t('Price', '价格') },
      ],
    },
  ],
}
