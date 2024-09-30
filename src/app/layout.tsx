import { getOptions } from '#/content'
import '#/styles/globals.css'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

const { title, url, description, locale } = getOptions([
  'title',
  'url',
  'description',
  'locale'
])

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s - ${title}`
  },
  description: description,
  alternates: {
    canonical: url
  },
  metadataBase: new URL(url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: title
  }
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang={locale} suppressHydrationWarning>
      {children}
    </html>
  )
}
