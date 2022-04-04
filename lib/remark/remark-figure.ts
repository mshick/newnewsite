import type { Transformer } from 'unified'
import type { ContainerDirective } from 'mdast-util-directive'
import type { BlockContent } from 'mdast'
import { visit } from 'unist-util-visit'
import { h } from 'hastscript'
import isEmpty from 'lodash-es/isEmpty.js'

const transform: Transformer = (tree) => {
  visit(
    tree,
    { type: 'containerDirective', name: 'figure' },
    (node: ContainerDirective) => {
      let currentGroupStart = 0

      const groupedCaptions = node.children.reduce<
        Record<number, BlockContent[]>
      >((g, n, i) => {
        if (
          n.type !== 'code' &&
          // @ts-expect-error
          n.type !== 'image' &&
          n.type !== 'leafDirective'
        ) {
          return {
            ...g,
            [currentGroupStart]: [...(g[currentGroupStart] ?? []), n],
          }
        }
        currentGroupStart = i + 1
        return g
      }, {})

      if (!isEmpty(groupedCaptions)) {
        for (const [startIndex, captionNodes] of Object.entries(
          groupedCaptions
        )) {
          const figcaption: BlockContent = {
            name: 'figcaption',
            type: 'containerDirective',
            children: captionNodes,
            data: {
              hName: 'figcaption',
            },
          }

          node.children.splice(
            +startIndex,
            figcaption.children.length,
            figcaption
          )
        }
      }

      const data = node.data || (node.data = {})
      const hast = h(node.name, node.attributes)

      data.hName = hast.tagName
      data.hProperties = hast.properties
    }
  )
}

export default function remarkFigure() {
  return transform
}
