const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.bruca.space'

export type Author = {
  id: string
  name: string
  affiliation?: string
}

export type Category = {
  id: string
  title: string
  slug: string
}

export type Article = {
  id: string
  title: string
  slug: string
  abstract?: string
  editedText?: unknown
  author: Author[]
  categories?: Category[]
  coverImage?: { url: string; alt?: string }
  publishedDate?: string
  updatedAt: string
}

type ListResponse = {
  docs: Article[]
}

const REVALIDATE_SECONDS = 300

export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const url = `${CMS_URL}/api/articles?where[workflowStatus][equals]=published&depth=2&limit=100&sort=-publishedDate`
    console.log('[blog] fetching articles from', url)
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })

    if (!res.ok) {
      console.error('[blog] articles fetch not ok:', res.status, await res.text())
      return []
    }

    const data = (await res.json()) as ListResponse
    console.log('[blog] got', data.docs?.length ?? 0, 'articles')
    return data.docs
  } catch (err) {
    console.error('[blog] articles fetch threw:', err)
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/articles?where[slug][equals]=${encodeURIComponent(slug)}&where[workflowStatus][equals]=published&depth=2&limit=1`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    )

    if (!res.ok) return null

    const data = (await res.json()) as ListResponse
    return data.docs[0] ?? null
  } catch {
    return null
  }
}
