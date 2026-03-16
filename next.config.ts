import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Images from Supabase Storage will need this if used later
  // images: { domains: ['your-project.supabase.co'] },
}

export default withPayload(nextConfig)
