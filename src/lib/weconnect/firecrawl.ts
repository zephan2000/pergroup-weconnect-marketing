import FirecrawlApp from '@mendable/firecrawl-js'

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! })

export interface ScrapedPage {
  markdown: string
  url: string
}

/**
 * Scrape a single URL and return its markdown content.
 */
export async function scrapePage(url: string): Promise<ScrapedPage | null> {
  try {
    const result = await firecrawl.scrape(url, { formats: ['markdown'] })
    if (!result.markdown) {
      console.warn(`Firecrawl: no markdown returned for ${url}`)
      return null
    }
    return { markdown: result.markdown, url }
  } catch (err) {
    console.error(`Firecrawl scrape failed for ${url}:`, err)
    return null
  }
}

/**
 * Crawl a site starting from a URL, following links that match includePaths.
 * Returns markdown for each crawled page.
 */
export async function crawlSite(
  url: string,
  options: {
    limit?: number
    includePaths?: string[]
    excludePaths?: string[]
  } = {}
): Promise<ScrapedPage[]> {
  try {
    const result = await firecrawl.crawl(url, {
      limit: options.limit ?? 50,
      includePaths: options.includePaths,
      excludePaths: options.excludePaths,
      scrapeOptions: { formats: ['markdown'] },
    })

    if (result.status === 'failed' || !result.data) {
      console.warn(`Firecrawl: crawl failed for ${url} (status: ${result.status})`)
      return []
    }

    return result.data
      .filter((page) => page.markdown)
      .map((page) => ({
        markdown: page.markdown!,
        url: page.metadata?.sourceURL ?? url,
      }))
  } catch (err) {
    console.error(`Firecrawl crawl failed for ${url}:`, err)
    return []
  }
}

/**
 * Sleep helper for rate limiting between requests.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
