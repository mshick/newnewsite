import { DocumentListPagination } from '#/components/Document/DocumentListPagination'
import { HomepageList } from '#/components/Homepage/HomepageList'
import { getSingle, isNumericString } from '#/lib/utils/types'
import { ServerProps } from '#/types/types'
import {
  filters,
  getPosts,
  getPostsCount,
  getTagByName,
  sorters
} from '@/content'
import { notFound } from 'next/navigation'

const PER_PAGE = 3

export const revalidate = 60

type Params = {
  name: string
}

// export function generateMetadata(): Metadata {
//   const page = getPage((value) => value.slug === 'index')
//   return page?.meta ?? {}
// }

export default function TagPage({ params, searchParams }: ServerProps<Params>) {
  const tag = getTagByName(params.name)

  if (!tag) {
    return notFound()
  }

  const currentPage = isNumericString(getSingle(searchParams['page']))
    ? Number(searchParams['page'])
    : 1
  const perPage = PER_PAGE
  const pageOffset = perPage * (currentPage - 1)

  const posts = getPosts(
    ['permalink', 'title', 'excerpt', 'excerptHtml', 'publishedAt'],
    ['tags'],
    (item) => item.tags.includes(tag.name),
    sorters.publishedAtDesc,
    perPage,
    pageOffset
  )

  const totalPosts = getPostsCount(filters.none)

  const totalPages = Math.ceil(totalPosts / perPage)

  return (
    <>
      <div className="prose prose-sm prose-tufted dark:prose-invert max-w-none">
        <HomepageList
          collectionName="posts"
          heading={`posts tagged w/ ${tag.name}`}
          href={tag.permalink}
          documents={posts}
        />
      </div>
      <DocumentListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        path={tag.permalink}
      />
    </>
  )
}
