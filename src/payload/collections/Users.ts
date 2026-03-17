/**
 * Users collection — Payload built-in auth for CMS editors only.
 *
 * SECURITY: This collection enables Payload's JWT-based admin panel login.
 * WeConnect user auth is NOT implemented here and is out of v1 scope.
 * See CLAUDE.md Authentication section and SECURITY.md.
 */
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { en: 'User', zh: '用户' },
    plural: { en: 'Users', zh: '用户列表' },
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    description: {
      en: 'CMS editor accounts. Login access to /admin only.',
      zh: 'CMS 编辑账号。仅用于 /admin 登录。',
    },
  },
  access: {
    // Only authenticated users can read/create/update/delete user records.
    // Public read is intentionally disabled.
    read: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { en: 'Full Name', zh: '姓名' },
    },
  ],
}
