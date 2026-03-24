import { NextRequest, NextResponse } from 'next/server'
import { createCrawlJob, updateCrawlJob } from '@/lib/weconnect/ingest-db'
import { extractSpace, extractSpaces } from '@/lib/weconnect/extract'
import { embedAndUpsert } from '@/lib/weconnect/embed'
import { scrapeJTCSpaces } from '@/lib/weconnect/sources/jtc'
import { scrapeJustCo } from '@/lib/weconnect/sources/justco'
import { scrapeWeWork } from '@/lib/weconnect/sources/wework'
import { scrapeCommercialGuru } from '@/lib/weconnect/sources/commercialguru'
import type { ScrapedPage } from '@/lib/weconnect/firecrawl'

interface SourceDef {
  name: string
  scrape: () => Promise<ScrapedPage[]>
  /** If true, each scraped page contains multiple listings (search results page) */
  multiExtract: boolean
}

const sources: SourceDef[] = [
  { name: 'jtc', scrape: scrapeJTCSpaces, multiExtract: true },
  { name: 'justco', scrape: scrapeJustCo, multiExtract: false },
  { name: 'wework', scrape: scrapeWeWork, multiExtract: false },
  { name: 'commercialguru', scrape: scrapeCommercialGuru, multiExtract: true },
]

/**
 * POST /api/ingest
 *
 * Main ingestion handler. Called by Vercel cron or manually with CRON_SECRET.
 * Runs all 4 scrapers sequentially, extracts structured data, generates
 * embeddings, and upserts into weconnect.spaces.
 */
export async function POST(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

      const pages = await source.scrape()
      pagesCount = pages.length
      console.log(`${source.name}: got ${pagesCount} pages`)

      for (const page of pages) {
        try {
          if (source.multiExtract) {
            // Search results page — extract multiple spaces
            const spaces = await extractSpaces(page.markdown, page.url)
            for (const space of spaces) {
              try {
                // Use a synthetic source_url with the space name for dedup
                const spaceUrl = `${page.url}#${encodeURIComponent(space.name)}`
                await embedAndUpsert(space, spaceUrl, source.name)
                upsertedCount++
                console.log(`${source.name}: upserted "${space.name}"`)
              } catch (err) {
                const msg = err instanceof Error ? err.message : String(err)
                errors.push(`${space.name}: ${msg}`)
                console.error(`${source.name}: embed/upsert failed for "${space.name}":`, msg)
              }
            }
            if (spaces.length === 0) {
              errors.push(`no spaces extracted: ${page.url}`)
            }
          } else {
            // Detail page — extract single space
            const extracted = await extractSpace(page.markdown, page.url)
            if (!extracted) {
              errors.push(`extraction failed: ${page.url}`)
              continue
            }

            await embedAndUpsert(extracted, page.url, source.name)
            upsertedCount++
            console.log(`${source.name}: upserted "${extracted.name}"`)
          }
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
  return NextResponse.json(summary, { status: statusCode })
}
