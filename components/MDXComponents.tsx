import type { ComponentMap } from 'mdx-bundler/client'
import { Box, components as themeUi } from 'theme-ui'
import Image from './Image'
import Link from './Link'

const MDXComponents: ComponentMap = {
  ...themeUi,
  a: Link,
  // @ts-expect-error
  img: Image,
  code: (props) => {
    return <code {...props} />
  },
  pre: (props) => {
    return <pre {...props} />
  },
  section: ({ ref, ...props }) => {
    return <Box as="section" variant="styles.section" {...props} />
  },
}

export default MDXComponents
