/**
 * VideoBlock — embeds a single video sourced from YouTube.
 *
 * Editors paste a YouTube URL (watch, youtu.be, or shorts) and the front-end
 * extracts the video ID and renders a privacy-enhanced iframe embed
 * (youtube-nocookie.com).
 *
 * Self-hosting was considered and rejected: Supabase Storage free tier caps
 * files at 50MB and egress at 5GB/month, which doesn't fit a marketing site.
 * YouTube provides free CDN + adaptive bitrate streaming.
 */
import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'video',
  labels: {
    singular: { en: 'Video Block', zh: '视频区块' },
    plural: { en: 'Video Blocks', zh: '视频区块' },
  },
  fields: [
    {
      name: 'youtubeUrl',
      type: 'text',
      required: true,
      label: { en: 'YouTube URL', zh: 'YouTube 链接' },
      admin: {
        description: {
          en: 'Paste any YouTube link: youtube.com/watch?v=…, youtu.be/…, or youtube.com/shorts/…. The video must be Public or Unlisted (not Private). Google Drive videos are not supported — upload to YouTube as Unlisted instead.',
          zh: '粘贴任意 YouTube 链接（watch、youtu.be 或 shorts）。视频必须为"公开"或"不公开列出"（不能为"私享"）。不支持 Google Drive 视频 — 请上传到 YouTube 并设为"不公开列出"。',
        },
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      label: { en: 'Caption', zh: '说明文字' },
      admin: { description: { en: 'Optional text shown below the video.', zh: '视频下方的可选说明文字。' } },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: '16:9',
      label: { en: 'Aspect Ratio', zh: '宽高比' },
      options: [
        { label: '16:9 (widescreen)', value: '16:9' },
        { label: '9:16 (vertical / shorts)', value: '9:16' },
        { label: '4:3 (classic)', value: '4:3' },
        { label: '1:1 (square)', value: '1:1' },
      ],
    },
    {
      name: 'autoplayMode',
      type: 'select',
      defaultValue: 'off',
      label: { en: 'Autoplay', zh: '自动播放' },
      options: [
        { label: { en: 'Off — viewer presses play', zh: '关闭 — 由观众点击播放' }, value: 'off' },
        { label: { en: 'On page load', zh: '页面加载时播放' }, value: 'onLoad' },
        { label: { en: 'When scrolled into view', zh: '滚动至可见时播放' }, value: 'onScroll' },
      ],
      admin: {
        description: {
          en: 'Browsers require muted for autoplay. Mute is forced on for both autoplay modes.',
          zh: '浏览器要求自动播放时必须静音。两种自动播放模式均会强制静音。',
        },
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Loop', zh: '循环播放' },
    },
    {
      name: 'startSeconds',
      type: 'number',
      min: 0,
      label: { en: 'Start at (seconds)', zh: '起始秒数' },
      admin: { description: { en: 'Optional: start the video at a specific second.', zh: '可选：从指定秒数开始播放。' } },
    },
  ],
}
