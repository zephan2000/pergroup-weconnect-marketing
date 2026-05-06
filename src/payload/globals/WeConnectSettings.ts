/**
 * Payload global: WeConnect Overlay Settings.
 * Tab labels + screen text for Needs / Alerts / Profile screens.
 * Distinct from PlatformSettings (which holds AI matching copy + legacy modal copy).
 */
import type { GlobalConfig } from 'payload'

const t = (en: string, zh: string) => ({ en, zh })

export const WeConnectSettings: GlobalConfig = {
  slug: 'weconnect-settings',
  label: t('WeConnect Overlay Settings', 'WeConnect 弹窗设置'),
  fields: [
    {
      type: 'collapsible',
      label: t('Tabs', '标签页'),
      fields: [
        { name: 'tabNeeds', type: 'text', localized: true, label: t('Needs Tab', '需求标签') },
        { name: 'tabAlerts', type: 'text', localized: true, label: t('Alerts Tab', '资讯标签') },
        { name: 'tabProfile', type: 'text', localized: true, label: t('Profile Tab', '我的标签') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Needs Screen — CTA Cards', '需求页 — 行动卡片'),
      fields: [
        { name: 'postNeed', type: 'text', localized: true, label: t('Post a Need (heading)', '发布需求（标题）') },
        { name: 'postNeedAccent', type: 'text', localized: true, label: t('Post a Need (accent word)', '发布需求（强调词）') },
        { name: 'postNeedDescription', type: 'text', localized: true, label: t('Post a Need (description)', '发布需求（描述）') },
        { name: 'shareOffering', type: 'text', localized: true, label: t('Share Offering (heading)', '分享能力（标题）') },
        { name: 'shareOfferingAccent', type: 'text', localized: true, label: t('Share Offering (accent word)', '分享能力（强调词）') },
        { name: 'shareOfferingDescription', type: 'text', localized: true, label: t('Share Offering (description)', '分享能力（描述）') },
        { name: 'recentNeeds', type: 'text', localized: true, label: t('Recent Needs heading', '最新需求标题') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Alerts Screen', '资讯页'),
      fields: [
        { name: 'advisoryAlerts', type: 'text', localized: true, label: t('Advisory Alerts heading', '顾问预警标题') },
        { name: 'previewLabel', type: 'text', localized: true, label: t('Preview badge', '示例预览标签') },
        { name: 'comingSoonLabel', type: 'text', localized: true, label: t('Coming Soon badge', '即将上线标签') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Profile Screen', '我的页'),
      fields: [
        { name: 'profileMember', type: 'text', localized: true, label: t('Member name', '会员名称') },
        { name: 'profileMemberSince', type: 'text', localized: true, label: t('Member since line', '加入时间') },
        { name: 'myPosts', type: 'text', localized: true, label: t('My Posts heading', '我的发布标题') },
        { name: 'companyProfile', type: 'text', localized: true, label: t('Company Profile heading', '公司档案标题') },
        { name: 'enterpriseUser', type: 'text', localized: true, label: t('Enterprise User label', '企业用户标签') },
        { name: 'enterpriseRole', type: 'text', localized: true, label: t('Enterprise Role label', '企业角色标签') },
      ],
    },
    {
      type: 'collapsible',
      label: t('Settings Screen', '设置页'),
      fields: [
        { name: 'settingsHeading', type: 'text', localized: true, label: t('Settings heading', '设置标题') },
        { name: 'settingLanguage', type: 'text', localized: true, label: t('Language setting', '语言设置') },
        { name: 'settingNotifications', type: 'text', localized: true, label: t('Notification setting', '通知设置') },
        { name: 'settingContactPg', type: 'text', localized: true, label: t('Contact PER GROUP', '联系 PER GROUP') },
        { name: 'settingAbout', type: 'text', localized: true, label: t('About WeConnect', '关于 WeConnect') },
      ],
    },
  ],
}
