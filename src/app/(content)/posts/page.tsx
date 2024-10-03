import { DocumentList } from '#/components/Document/DocumentList'
import { DocumentListHeader } from '#/components/Document/DocumentListHeader'
import { DocumentListItem } from '#/components/Document/DocumentListItem'
import { DocumentListPagination } from '#/components/Document/DocumentListPagination'
import {
  filters,
  getOptions,
  getPosts,
  getPostsCount,
  sorters
} from '#/content'
import { getPagination } from '#/lib/utils/pagination'
import { type ServerProps } from '#/types/types'
import { type Metadata } from 'next'
import slug from 'slug'

const HEADING = 'posts'

export const revalidate = 60

export function generateMetadata(): Metadata {
  return {
    title: HEADING
  }
}

export default function PostsPage({ searchParams }: ServerProps) {
  const heading = HEADING

  const { currentPage, perPage, pageOffset, totalPages } = getPagination(
    searchParams,
    getOptions(['collections']).collections?.find((c) => c.name === 'posts')
      ?.pagination ?? { perPage: 3 },
    getPostsCount()
  )

  const posts = getPosts(
    ['permalink', 'title', 'excerpt', 'excerptHtml', 'publishedAt'],
    ['tags'],
    filters.none,
    sorters.publishedAtDesc,
    perPage,
    pageOffset
  )

  return (
    <>
      <div className="prose prose-sm prose-tufted dark:prose-invert max-w-none">
        <section id={`list-${slug(heading)}`} className="not-prose py-3.5">
          <DocumentListHeader heading={heading} />
          <DocumentList documents={posts}>
            {(item) => <DocumentListItem className="py-2 px-4" {...item} />}
          </DocumentList>
        </section>
      </div>
      <DocumentListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        path="/posts/"
      />
    </>
  )
}
