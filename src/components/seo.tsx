import { Helmet } from 'react-helmet-async'

type SeoProps = {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
}

export function Seo({ title, description, canonical, ogImage }: SeoProps) {
  const siteName = 'SoRa Clinic'
  const defaultTitle = 'SoRa Clinic — K-Beauty Global'
  const defaultDescription = 'K-뷰티 전문 SoRa Clinic의 글로벌 스킨케어 서비스'
  const defaultUrl = 'https://sora-react.vercel.app/'
  const defaultImage = '/icons/og-image.png'

  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      {/* Canonical */}
      <link rel="canonical" href={canonical || defaultUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={canonical || defaultUrl} />
      <meta property="og:image" content={ogImage || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
    </Helmet>
  )
}
