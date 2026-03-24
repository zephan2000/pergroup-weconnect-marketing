import { scrapePage, sleep, type ScrapedPage } from '../firecrawl'

const INDEX_URLS = [
  'https://www.commercialguru.com.sg/property-for-rent?property_type=O',
  'https://www.commercialguru.com.sg/property-for-rent?property_type=O&page=2',
  'https://www.commercialguru.com.sg/property-for-rent?property_type=O&page=3',
]

/**
 * Scrape CommercialGuru office listings.
 * Uses scrapePage on index pages (crawlSite was being blocked by anti-bot).
 * Each index page is a search results page with multiple listings —
 * the ingest route uses extractSpaces (multi-extract) for these.
 */
export async function scrapeCommercialGuru(): Promise<ScrapedPage[]> {
  const results: ScrapedPage[] = []

  for (const url of INDEX_URLS) {
    console.log(`CommercialGuru: scraping ${url}`)
    const page = await scrapePage(url)

    if (page && page.markdown.length > 1000) {
      results.push(page)
      console.log(`CommercialGuru: got content from ${url} (${page.markdown.length} chars)`)
    } else {
      console.warn(`CommercialGuru: no useful content from ${url} (${page?.markdown.length ?? 0} chars)`)
    }

    await sleep(2000)
  }

  console.log(`CommercialGuru: scraped ${results.length} index pages`)
  return results
}
