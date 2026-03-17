/**
 * Marketing home page — /
 *
 * Fetches the "home" page document from Payload CMS and renders it
 * through BlockRenderer. All data comes from Supabase cms schema via Payload.
 * No data is hardcoded here.
 */
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import BlockRenderer from '@/components/BlockRenderer'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'

// Dynamic rendering — page fetches from DB at request time, not at build time.
// Required because Payload CMS data is not available during static generation.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { isEnabled: isDraft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    limit: 1,
    draft: isDraft, // fetches latest draft in preview, published otherwise
  })

  const page = result.docs[0]

  if (!page) {
    return (
      <main style={{ padding: '4rem', fontFamily: 'monospace', color: '#F5A82A', minHeight: '100vh' }}>
        <p>No homepage content yet.</p>
        <p style={{ marginTop: '1rem', color: 'rgba(221,224,232,0.4)', fontSize: '13px' }}>
          Go to <Link href="/admin" style={{ color: '#F5A82A' }}>/admin</Link>, create a Page with slug{' '}
          <code>&quot;home&quot;</code>, and add blocks.
        </p>
      </main>
    )
  }

  return (
    <>
      {isDraft && <RefreshRouteOnSave />}
      <BlockRenderer blocks={(page.blocks as { blockType: string; [key: string]: unknown }[]) ?? []} />
    </>
  )
}
