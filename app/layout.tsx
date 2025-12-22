import { Metadata } from "next";
import TopProgressBar from "./components/top-progress-bar";
import { CartProvider } from '@/context/CartContext';
import "./globals.css";
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vitaway.org"),
  title: {
    default: "Vitaway Health - Digital Healthcare Solutions for Rwanda",
    template: "%s | Vitaway Health"
  },
  description: "Vitaway Health provides comprehensive digital healthcare solutions for Rwandans and youth globally. Expert nutrition guidance, NCD prevention, telehealth consultations, and wellness programs.",
  keywords: [
    "Rwanda healthcare",
    "digital health platform",
    "nutrition counseling Rwanda",
    "NCD prevention",
    "telehealth Rwanda",
    "health education",
    "wellness programs",
    "Vitaway health",
    "e-clinic Rwanda",
    "nutrition awareness",
    "healthy lifestyle",
    "preventive healthcare",
    "health consultation online"
  ],
  authors: [{ name: "Vitaway Health Team" }],
  creator: "Vitaway Health Ltd",
  publisher: "Vitaway Health Ltd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.vitaway.org",
    siteName: "Vitaway Health",
    title: "Vitaway Health - Digital Healthcare Solutions for Rwanda",
    description: "Comprehensive digital healthcare solutions for Rwandans and youth globally. Expert nutrition guidance, NCD prevention, and wellness programs.",
    images: [
      {
        url: "/images/vitaway-og-image.png",
        width: 1200,
        height: 630,
        alt: "Vitaway Health - Digital Healthcare Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitaway Health - Digital Healthcare Solutions for Rwanda",
    description: "Comprehensive digital healthcare solutions for Rwandans and youth globally. Expert nutrition guidance, NCD prevention, and wellness programs.",
    images: ["/images/vitaway-twitter-image.png"],
    creator: "@VitawayHealth",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code-here", // Replace with actual code
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: "#003E48",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vitaway Health Ltd",
    "description": "Digital healthcare solutions provider in Rwanda offering nutrition counseling, NCD prevention, and wellness programs.",
    "url": "https://www.vitaway.org",
    "logo": "https://www.vitaway.org/images/vitaway-logo.png",
    "foundingDate": "2020",
    "founders": [
      {
        "@type": "Person",
        "name": "Vitaway Health Team"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "CPR-Unit House, 1st Floor, KK21 Ave Niboye",
      "addressLocality": "Kicukiro",
      "addressRegion": "Kigali",
      "addressCountry": "Rwanda"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+250-795-767-405",
      "contactType": "customer service",
      "email": "vitawayeclinic@gmail.com"
    },
    "sameAs": [
      "https://www.facebook.com/VitawayHealth",
      "https://www.twitter.com/VitawayHealth",
      "https://www.instagram.com/VitawayHealth",
      "https://www.linkedin.com/company/vitaway-health"
    ],
    "serviceArea": {
      "@type": "Country",
      "name": "Rwanda"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Healthcare Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Nutrition Counseling",
            "description": "Professional nutrition guidance and meal planning"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Health Consultation",
            "description": "Online health consultations with qualified professionals"
          }
        }
      ]
    }
  };

  return (
    <html lang="en">
      <head>
        <Script 
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script src="//code.tidio.co/mwzeombpb11eeirlfz6ba2uar9jhcvoc.js" strategy="afterInteractive" />
      </head>
      <body className="app-body">
        <TopProgressBar />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
