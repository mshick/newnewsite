import { omit } from '@contentlayer/utils'
import type { ComputedFields, FieldDefs } from 'contentlayer/source-files'
import {
  defineDocumentType,
  defineNestedType,
  makeSource
} from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import { remarkMdxImages } from 'remark-mdx-images'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import remarkUnwrapImages from 'remark-unwrap-images'
import { contentDirPath, publicDir } from './src/config'
import rehypeImgSize from './src/lib/rehype/rehype-img-size'
import remarkEpigraph from './src/lib/remark/remark-epigraph'
import remarkFigure from './src/lib/remark/remark-figure'
import remarkFooter from './src/lib/remark/remark-footer'
import remarkInitialHeading from './src/lib/remark/remark-initial-heading'
import remarkNewthought from './src/lib/remark/remark-newthought'
import remarkSectionize from './src/lib/remark/remark-sectionize'
import remarkSidenotes from './src/lib/remark/remark-sidenotes'
import remarkWrapImages from './src/lib/remark/remark-wrap-images'
import remarkYoutube from './src/lib/remark/remark-youtube'
import {
  getEditUrl,
  getExcerpt,
  getPath,
  getPublishedAt,
  getReadingTime,
  getShareUrl,
  getSlug,
  getTags,
  getUpdatedAt,
  getUpdatedBy,
  getUpdatedByEmail
} from './src/utils/fields'

const Image = defineNestedType(() => ({
  name: 'Image',
  fields: {
    url: { type: 'string', required: false },
    title: { type: 'string', required: false },
    alt: { type: 'string', required: false },
    caption: { type: 'string', required: false }
  }
}))

const Tag = defineNestedType(() => ({
  name: 'Tag',
  fields: {
    name: { type: 'string', required: true },
    path: { type: 'string', required: true }
  }
}))

const fields: FieldDefs = {
  author: { type: 'string', required: false },
  excerpt: { type: 'string', required: false },
  image: { type: 'nested', of: Image, required: false },
  isPrivate: { type: 'boolean', required: false, default: false },
  pinned: { type: 'boolean', default: false },
  publishedAt: { type: 'string', required: true },
  tags: { type: 'list', of: { type: 'string' }, required: false },
  title: { type: 'string', required: true },
  updatedAt: { type: 'string', required: false },
  featured: { type: 'boolean', required: false }
}

const computedFields: ComputedFields = {
  readingTime: {
    type: 'json',
    resolve: getReadingTime
  },
  excerpt: {
    type: 'string',
    resolve: getExcerpt
  },
  slug: {
    type: 'string',
    resolve: getSlug
  },
  path: {
    type: 'string',
    resolve: getPath
  },
  updatedAt: {
    type: 'date',
    resolve: getUpdatedAt
  },
  publishedAt: {
    type: 'date',
    resolve: getPublishedAt
  },
  updatedBy: {
    type: 'string',
    resolve: getUpdatedBy
  },
  updatedByEmail: {
    type: 'string',
    resolve: getUpdatedByEmail
  },
  author: {
    type: 'string',
    resolve: async (doc) => {
      return doc.author ?? (await getUpdatedBy(doc))
    }
  },
  tags: {
    type: 'json',
    resolve: getTags
  },
  editUrl: {
    type: 'string',
    resolve: getEditUrl
  },
  shareUrl: {
    type: 'string',
    resolve: getShareUrl
  }
}

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages__*.{md,mdx}',
  contentType: 'mdx',
  fields: omit(fields, ['pinned']),
  computedFields: omit(computedFields, ['readingTime'])
}))

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: 'articles__*.{md,mdx}',
  contentType: 'mdx',
  fields,
  computedFields
}))

export default makeSource({
  contentDirPath: contentDirPath,
  documentTypes: [Article, Page],
  mdx: {
    remarkPlugins: [
      remarkGemoji,
      remarkDirective,
      remarkDirectiveRehype,
      remarkYoutube,
      remarkUnwrapImages,
      remarkWrapImages,
      remarkFigure,
      remarkFooter,
      remarkNewthought,
      remarkGfm,
      remarkSidenotes,
      remarkSqueezeParagraphs,
      remarkInitialHeading,
      [remarkSectionize, { maxHeadingDepth: 2 }],
      remarkEpigraph,
      remarkMdxImages
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeCodeTitles,
      [rehypePrism, { ignoreMissing: true }],
      [rehypeImgSize, { dir: contentDirPath }],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor']
          }
        }
      ]
    ],
    esbuildOptions: (options) => {
      options.platform = 'node'
      options.outdir = publicDir
      options.assetNames = `images/[dir]/[name]`
      options.loader = {
        ...options.loader,
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.svg': 'file',
        '.webp': 'file',
        '.gif': 'file'
      }
      options.publicPath = '/'
      options.write = true
      return options
    }
  }
})
