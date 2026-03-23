import { crawlSite, scrapePage, sleep, type ScrapedPage } from '../../../lib/firecrawl'

const INDEX_URL = 'https://www.commercialguru.com.sg/singapore/office-for-rent'
const DETAIL_URL_REGEX =
  /https:\/\/www\.commercialguru\.com\.sg\/singapore\/[a-z0-9-]+-for-rent\/[a-z0-9-]+-\d+/g

/**
 * Scrape CommercialGuru office listings.
 * Step 1: Crawl index pages to discover listing detail URLs.
 * Step 2: Deduplicate URLs.
 * Step 3: Scrape each detail page in chunks of 10 concurrently.
 */
export async function scrapeCommercialGuru(): Promise<ScrapedPage[]> {
  console.log(`CommercialGuru: crawling index — ${INDEX_URL}`)

  // Step 1: Crawl index pages
  const indexPages = await crawlSite(INDEX_URL, {
    limit: 50,
    includePaths: ['/singapore/office-for-rent*'],
    excludePaths: ['/login', '/register', '/agent*'],
  })

  console.log(`CommercialGuru: crawled ${indexPages.length} index pages`)

  // Step 2: Extract and deduplicate listing detail URLs from all index pages
  const allUrls = new Set<string>()
  for (const page of indexPages) {
    const matches = page.markdown.match(DETAIL_URL_REGEX)
    if (matches) {
      matches.forEach((url) => allUrls.add(url))
    }
  }

  const detailUrls = [...allUrls]
  console.log(`CommercialGuru: found ${detailUrls.length} unique detail URLs`)

  // Step 3: Scrape detail pages in chunks of 10
  const results: ScrapedPage[] = []
  const chunkSize = 10

  for (let i = 0; i < detailUrls.length; i += chunkSize) {
    const chunk = detailUrls.slice(i, i + chunkSize)
    const chunkResults = await Promise.all(chunk.map((url) => scrapePage(url)))

    for (const result of chunkResults) {
      if (result) results.push(result)
    }

    console.log(`CommercialGuru: scraped chunk ${Math.floor(i / chunkSize) + 1} (${results.length} total)`)
    await sleep(500)
  }

  console.log(`CommercialGuru: scraped ${results.length} detail pages`)
  return results
}
