import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Images from Supabase Storage will need this if used later
  // images: { domains: ['your-project.supabase.co'] },

  webpack: (webpackConfig) => {
    // Required by Payload v3 + Next.js 15: allows TypeScript/JavaScript file extensions
    // to resolve correctly when Payload's internal packages reference .js imports that
    // actually map to .ts source files.
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
}

// devBundleServerPackages: false — prevents webpack from bundling Payload's
// server-only packages (including Monaco editor internals) into the client
// bundle during development, which causes the "Cannot destructure property
// 'config'" crash on every admin route.
export default withPayload(nextConfig, { devBundleServerPackages: false })
