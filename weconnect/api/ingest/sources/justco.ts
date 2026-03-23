import { crawlSite, type ScrapedPage } from '../../../lib/firecrawl'

const JUSTCO_URL = 'https://www.justcoglobal.com/en/'

/**
 * Scrape JustCo Singapore locations.
 * Crawls the global site and filters to Singapore location pages.
 */
export async function scrapeJustCo(): Promise<ScrapedPage[]> {
  console.log(`JustCo: crawling ${JUSTCO_URL}`)

  const pages = await crawlSite(JUSTCO_URL, {
    limit: 50,
    includePaths: ['/en/locations/*', '/en/singapore/*'],
    excludePaths: ['/en/login', '/en/register', '/en/blog/*'],
  })

  console.log(`JustCo: crawled ${pages.length} pages`)
  return pages
}
