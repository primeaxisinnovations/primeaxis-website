import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeaxisinnovations.com.ng'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/admin/*', '/api', '/api/', '/api/*'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
