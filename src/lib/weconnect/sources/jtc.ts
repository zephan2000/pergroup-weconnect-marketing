import { scrapePage, sleep, type ScrapedPage } from '../firecrawl'

const BASE_URL = 'https://www.jtc.gov.sg/find-space'
const MAX_PAGES = 10

/**
 * Scrape JTC space listings by paginating through the find-space page.
 * Stops when the page no longer contains "per sqm/mth" or after MAX_PAGES.
 */
export async function scrapeJTCSpaces(): Promise<ScrapedPage[]> {
  const results: ScrapedPage[] = []

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${BASE_URL}?page=${page}`
    console.log(`JTC: scraping page ${page} — ${url}`)

    const scraped = await scrapePage(url)
    if (!scraped) {
      console.warn(`JTC: no result for page ${page}, stopping`)
      break
    }

    if (!scraped.markdown.includes('per sqm/mth')) {
      console.log(`JTC: page ${page} has no pricing data, stopping`)
      break
    }

    results.push(scraped)
    await sleep(1500)
  }

  console.log(`JTC: scraped ${results.length} pages`)
  return results
}
