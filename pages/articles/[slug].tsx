import { allArticles } from '.contentlayer/generated'
import ArticleLayout from 'components/layouts/article'
import type { Article } from 'lib/types'
import type { InferGetStaticPropsType } from 'next'

export default function Article({
  article
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <ArticleLayout article={article} />
}

export async function getStaticPaths() {
  return {
    paths: allArticles.map((article) => ({ params: { slug: article.slug } })),
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const article = (allArticles as unknown as Article[]).find(
    (article) => article.slug === params.slug
  )
  return { props: { article } }
}
