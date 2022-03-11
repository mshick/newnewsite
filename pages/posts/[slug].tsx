import { useMDXComponent } from 'next-contentlayer/hooks'
import { allPosts } from '.contentlayer/generated'
import type { Post } from '.contentlayer/generated'
import PostLayout from 'components/Post'

type PostProps = {
  post: Post
}

export default function Post({ post }: PostProps) {
  console.log(post)
  const Component = useMDXComponent(post.body.code)

  return (
    <PostLayout {...post}>
      <Component />
    </PostLayout>
  )
}

export async function getStaticPaths() {
  return {
    paths: allPosts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((post) => post.slug === params.slug)
  return { props: { post } }
}
