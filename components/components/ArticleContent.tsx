import type { Image, MDX } from '.contentlayer/generated'
import { format } from 'date-fns'
import type { Tag } from 'lib/types'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { Fragment } from 'react'
import type { ReadTimeResults } from 'reading-time'
import { Alert, Box, Heading, Paragraph, Text } from 'theme-ui'
import Link from './Link'
import components from './MDXComponents'

const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd')

export type ArticleContentProps = {
  title: string
  tags: Tag[]
  publishedAt: string
  updatedAt?: string
  author?: string
  isPrivate: boolean
  image?: Image
  body: MDX
  readingTime?: ReadTimeResults
}

export default function ArticleContent({
  title,
  tags,
  publishedAt,
  updatedAt,
  author,
  isPrivate,
  image,
  body,
  readingTime
}: ArticleContentProps) {
  const Component = useMDXComponent(body.code)
  return (
    <Box as="article">
      {isPrivate && (
        <Alert variant="error" sx={{ mb: 4 }}>
          This is a private post
        </Alert>
      )}

      <Box sx={{ mb: 5, mt: 2 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Text sx={{ color: 'muted', fontSize: 0 }}>
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          </Text>
          <Text sx={{ color: 'muted', ml: 2, fontSize: 0 }}>
            <time dateTime={updatedAt}>[updated: {formatDate(updatedAt)}]</time>
          </Text>
          {readingTime ? (
            <Fragment>
              <Text sx={{ m: 2 }}>/</Text>
              <Text sx={{ color: 'muted', fontSize: 0 }}>
                {readingTime.text}
              </Text>
            </Fragment>
          ) : null}
        </Box>

        {tags ? (
          <Box
            as="ul"
            sx={{
              p: 0,
              listStyle: 'none',
              display: 'inline',
              ml: 0,
              mr: 0,
              textAlign: 'right'
            }}
          >
            {tags.map((tag) => {
              return (
                <Box
                  as="li"
                  key={tag.slug}
                  sx={{ display: 'inline', m: 0, fontSize: 0 }}
                >
                  <Link href={tag.path} variant="tag">
                    {tag.slug}
                  </Link>
                </Box>
              )
            })}
          </Box>
        ) : null}

        <Box sx={{ textAlign: 'left', mt: 5 }}>
          <Heading
            as="h1"
            variant="styles.h1"
            sx={{ lineHeight: 1.3, maxWidth: ['100%', '100%', '100%', '80%'] }}
          >
            {title}
          </Heading>

          {author ? (
            <Paragraph
              sx={{
                fontStyle: 'italic',
                mt: 2,
                mb: 3,
                fontSize: 2,
                lineHeight: 'body'
              }}
            >
              {author}
            </Paragraph>
          ) : null}
        </Box>
      </Box>

      <Component components={components} />
    </Box>
  )
}
