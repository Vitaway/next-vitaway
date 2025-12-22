import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  author?: string;
  section?: string;
}

export function generateSEO({
  title,
  description,
  keywords = [],
  image = '/images/vitaway-og-default.png',
  url = 'https://www.vitaway.org',
  type = 'website',
  publishedTime,
  author,
  section,
}: SEOProps): Metadata {
  const siteName = 'Vitaway Health';
  const fullTitle = title.includes('Vitaway') ? title : `${title} | ${siteName}`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: 'Vitaway Health Team' }],
    creator: 'Vitaway Health Ltd',
    publisher: 'Vitaway Health Ltd',
    openGraph: {
      title: fullTitle,
      description,
      type,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && publishedTime && {
        publishedTime,
        section,
        authors: [author || 'Vitaway Health Team'],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@VitawayHealth',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Common keyword sets for different page types
export const COMMON_KEYWORDS = {
  healthcare: [
    'healthcare Rwanda',
    'digital health',
    'telehealth',
    'preventive medicine',
    'health technology',
  ],
  nutrition: [
    'nutrition counseling',
    'nutritionist Rwanda',
    'healthy eating',
    'dietary advice',
    'meal planning',
  ],
  wellness: [
    'wellness programs',
    'health coaching',
    'lifestyle medicine',
    'holistic health',
    'wellbeing',
  ],
  rwanda: [
    'Rwanda healthcare',
    'Kigali health services',
    'African health tech',
    'East Africa wellness',
  ],
  ncd: [
    'NCD prevention',
    'diabetes prevention',
    'hypertension management',
    'cardiovascular health',
    'chronic disease prevention',
  ],
};

// Schema.org structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vitaway Health Ltd',
    description: 'Digital healthcare solutions provider in Rwanda offering nutrition counseling, NCD prevention, and wellness programs.',
    url: 'https://www.vitaway.org',
    logo: 'https://www.vitaway.org/images/vitaway-logo.png',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'CPR-Unit House, 1st Floor, KK21 Ave Niboye',
      addressLocality: 'Kicukiro',
      addressRegion: 'Kigali',
      addressCountry: 'Rwanda',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+250-795-767-405',
      contactType: 'customer service',
      email: 'vitawayeclinic@gmail.com',
    },
    sameAs: [
      'https://www.facebook.com/VitawayHealth',
      'https://www.twitter.com/VitawayHealth',
      'https://www.instagram.com/VitawayHealth',
      'https://www.linkedin.com/company/vitaway-health',
    ],
  };
}

export function generateBlogPostSchema({
  title,
  description,
  publishedDate,
  modifiedDate,
  author,
  image,
  url,
}: {
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate?: string;
  author: string;
  image: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: [image],
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vitaway Health',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.vitaway.org/images/vitaway-logo.png',
      },
    },
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function generateServiceSchema({
  name,
  description,
  provider = 'Vitaway Health Ltd',
  areaServed = 'Rwanda',
}: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
    },
    areaServed: {
      '@type': 'Country',
      name: areaServed,
    },
  };
}