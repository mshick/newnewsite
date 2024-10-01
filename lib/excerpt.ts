import { excerpt as hastExcerpt } from 'hast-util-excerpt'
import { raw } from 'hast-util-raw'
import { toHtml } from 'hast-util-to-html'
import { toText } from 'hast-util-to-text'
import { truncate } from 'hast-util-truncate'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toHast } from 'mdast-util-to-hast'
import { z } from 'velite'

export const DEFAULT_EXCERPT_LENGTH = 260

export interface ExcerptOptions {
  /**
   * Excerpt format.
   * @default 'html'
   * @example
   * s.excerpt({ format: 'text' }) // convert to plain text
   */
  format?: 'html' | 'text'
  /**
   * Excerpt separator.
   * @default 'more'
   * @example
   * s.excerpt({ separator: 'preview' }) // split excerpt by `<!-- preview -->`
   */
  separator?: string
  /**
   * Excerpt length.
   * @default 260
   */
  length?: number
}

type ExcerptFnCtx = {
  addIssue?: (arg: z.IssueData) => void
  meta: {
    content?: string
  }
}

export function excerptFn(
  {
    separator = 'more',
    length = DEFAULT_EXCERPT_LENGTH,
    format = 'html'
  }: ExcerptOptions = {},
  value?: string,
  ctx?: ExcerptFnCtx
) {
  if (value == null && ctx?.meta.content != null) {
    value = ctx?.meta.content
  }

  if (!value) {
    return
  }

  try {
    const mdast = fromMarkdown(value)
    const hast = toHast(mdast, { allowDangerousHtml: true })

    if (!hast) {
      return
    }

    const rawHast = raw(hast)
    const exHast = hastExcerpt(rawHast, {
      comment: separator,
      maxSearchSize: 1024
    })

    const output = exHast ?? truncate(rawHast, { size: length, ellipsis: '…' })

    return format === 'html' ? toHtml(output) : toText(output)
  } catch (err: any) {
    ctx?.addIssue?.({ fatal: true, code: 'custom', message: err.message })
    return value
  }
}

export const excerpt = (options: ExcerptOptions = {}) =>
  z.custom<string>().transform((value, ctx) => {
    return excerptFn(options, value, ctx)
  })
