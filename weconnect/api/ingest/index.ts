import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createCrawlJob, updateCrawlJob } from '../../lib/supabase'
import { extractSpace } from './extract'
import { embedAndUpsert } from './embed'
import { scrapeJTCSpaces } from './sources/jtc'
import { scrapeJustCo } from './sources/justco'
import { scrapeWeWork } from './sources/wework'
import { scrapeCommercialGuru } from './sources/commercialguru'
import type { ScrapedPage } from '../../lib/firecrawl'

export const config = { runtime: 'edge' }

interface SourceDef {
  name: string
  scrape: () => Promise<ScrapedPage[]>
}

const sources: SourceDef[] = [
  { name: 'jtc', scrape: scrapeJTCSpaces },
  { name: 'justco', scrape: scrapeJustCo },
  { name: 'wework', scrape: scrapeWeWork },
  { name: 'commercialguru', scrape: scrapeCommercialGuru },
]

/**
 * POST /api/ingest
 *
 * Main ingestion handler. Called by Vercel cron or manually with CRON_SECRET.
 * Runs all 4 scrapers sequentially, extracts structured data, generates
 * embeddings, and upserts into weconnect.spaces.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Auth check
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const summary: {
    ok: boolean
    sources: Record<string, { pages: number; upserted: number; errors: string[] }>
    totalUpserted: number
  } = {
    ok: true,
    sources: {},
    totalUpserted: 0,
  }

  for (const source of sources) {
    const jobId = await createCrawlJob(source.name)
    const errors: string[] = []
    let pagesCount = 0
    let upsertedCount = 0

    try {
      console.log(`\n── ${source.name.toUpperCase()} ──`)

      // 1. Scrape
      const pages = await source.scrape()
      pagesCount = pages.length
      console.log(`${source.name}: got ${pagesCount} pages`)

      // 2. Extract + embed + upsert each page
      for (const page of pages) {
        try {
          const extracted = await extractSpace(page.markdown, page.url)
          if (!extracted) {
            errors.push(`extraction failed: ${page.url}`)
            continue
          }

          await embedAndUpsert(extracted, page.url, source.name)
          upsertedCount++
          console.log(`${source.name}: upserted "${extracted.name}"`)
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          errors.push(`${page.url}: ${msg}`)
          console.error(`${source.name}: error processing ${page.url}:`, msg)
        }
      }

      await updateCrawlJob(jobId, {
        status: 'done',
        pages_crawled: pagesCount,
        spaces_upserted: upsertedCount,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`scraper error: ${msg}`)
      console.error(`${source.name}: scraper failed:`, msg)

      await updateCrawlJob(jobId, {
        status: 'failed',
        pages_crawled: pagesCount,
        spaces_upserted: upsertedCount,
        error: msg,
      })

      summary.ok = false
    }

    summary.sources[source.name] = {
      pages: pagesCount,
      upserted: upsertedCount,
      errors,
    }
    summary.totalUpserted += upsertedCount
  }

  const statusCode = summary.ok ? 200 : 207
  return res.status(statusCode).json(summary)
}
