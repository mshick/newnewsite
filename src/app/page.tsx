import { MDXContent } from '#/components/MDXContent'
import { HomepageHero } from '#/features/Homepage/HomepageHero'
import { HomepageList as HomepageListVelite } from '#/features/Homepage/HomepageListVelite'
import { components } from '#/mdx'
import { getPage, getPosts } from '@/content'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 60

export function generateMetadata(): Metadata {
  const page = getPage((value) => value.slug === 'index')
  return page?.meta ?? {}
}

export default function IndexPage() {
  const page = getPage((value) => value.slug === 'index')

  if (!page) {
    return notFound()
  }

  const posts = getPosts(
    ['permalink', 'title', 'excerpt', 'excerptHtml', 'publishedAt', 'featured'],
    ['tags'],
    (p) => p.featured
  )

  const bodyComponents = {
    ...components,
    HomepageHero,
    HomepageArticlesList: () => (
      <HomepageListVelite heading="blog" href="/articles" documents={posts} />
    )
  }

  return (
    <div className="prose prose-sm prose-tufted dark:prose-invert max-w-none">
      <MDXContent code={page.code} components={bodyComponents} />
    </div>
  )
}
