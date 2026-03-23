import { scrapePage, sleep, type ScrapedPage } from '../firecrawl'

const INDEX_URL = 'https://www.wework.com/en-SG/buildings'

/**
 * Scrape WeWork Singapore buildings.
 * Step 1: Scrape the index page to get building slugs.
 * Step 2: Scrape each building detail page.
 */
export async function scrapeWeWork(): Promise<ScrapedPage[]> {
  console.log(`WeWork: scraping index — ${INDEX_URL}`)

  const indexPage = await scrapePage(INDEX_URL)
  if (!indexPage) {
    console.warn('WeWork: failed to scrape index page')
    return []
  }

  const slugMatches = indexPage.markdown.match(/\/en-SG\/buildings\/[a-z0-9-]+/g)
  if (!slugMatches) {
    console.warn('WeWork: no building slugs found in index')
    return [indexPage]
  }

  const uniqueSlugs = [...new Set(slugMatches)]
  console.log(`WeWork: found ${uniqueSlugs.length} building slugs`)

  const results: ScrapedPage[] = []
  for (const slug of uniqueSlugs) {
    const url = `https://www.wework.com${slug}`
    const page = await scrapePage(url)
    if (page) {
      results.push(page)
    }
    await sleep(500)
  }

  console.log(`WeWork: scraped ${results.length} building pages`)
  return results
}
