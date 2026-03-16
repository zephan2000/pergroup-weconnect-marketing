/**
 * Payload CMS admin panel.
 * Handled entirely by @payloadcms/next — do not add custom code here.
 *
 * Access: /admin
 * SECURITY: Disallowed in robots.txt. Login requires Payload Users collection credentials.
 *
 * DECISION: Using the pattern from Payload v3 docs.
 * Verify: if the admin panel fails to load, check the @payloadcms/next version's
 * exported names (RootPage, generatePageMetadata) against the installed package.
 */
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import configPromise from '@payload-config'

export const generateMetadata = generatePageMetadata({ config: configPromise })

export default RootPage
