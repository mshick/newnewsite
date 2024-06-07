import { canonicalUrl, isProduction } from 'env'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: isProduction ? '/' : undefined,
      disallow: isProduction ? undefined : '/'
    },
    sitemap: `${canonicalUrl}/sitemap.xml`
  }
}
