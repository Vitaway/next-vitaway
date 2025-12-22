import { Metadata } from "next";
import Consultation from "./components/sections/consultation";
import DiabeteProgram from "./components/sections/diabete-program";
import Hero from "./components/sections/hero";
import Partenership from "./components/sections/partenership";
import Services from "./components/sections/services";
import Video from "./components/sections/video";
import GuestLayout from "./layouts/GuestLayout";
import Blogs from "./components/sections/blogs";

export const metadata: Metadata = {
  title: "Digital Healthcare Solutions for Rwanda",
  description: "Transform your health with Vitaway's comprehensive digital healthcare platform. Get expert nutrition counseling, NCD prevention programs, online consultations, and personalized wellness plans. Trusted by thousands across Rwanda.",
  keywords: [
    "Rwanda healthcare platform",
    "digital health solutions Rwanda",
    "nutrition counseling Kigali",
    "NCD prevention Rwanda",
    "online health consultation",
    "wellness programs Rwanda",
    "health education platform",
    "telehealth services",
    "preventive healthcare",
    "nutrition awareness Rwanda",
    "healthy lifestyle programs",
    "e-health platform",
    "Vitaway Health",
    "digital clinic Rwanda",
    "vitaway"
  ],
  openGraph: {
    title: "Digital Healthcare Solutions for Rwanda | Vitaway Health",
    description: "Transform your health with Vitaway's comprehensive digital healthcare platform. Expert nutrition counseling, NCD prevention, and wellness programs for Rwandans.",
    type: "website",
    url: "https://www.vitaway.org",
    images: [
      {
        url: "/images/vitaway-homepage-og.png",
        width: 1200,
        height: 630,
        alt: "Vitaway Health - Digital Healthcare Solutions for Rwanda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Healthcare Solutions for Rwanda | Vitaway Health",
    description: "Transform your health with Vitaway's comprehensive digital healthcare platform. Expert nutrition counseling, NCD prevention, and wellness programs.",
    images: ["/images/vitaway-homepage-twitter.png"],
  },
  alternates: {
    canonical: "https://www.vitaway.org",
    languages: {
      'en': 'https://www.vitaway.org',
      'rw': 'https://www.vitaway.org/rw', // If you have Kinyarwanda version
      'fr': 'https://www.vitaway.org/fr', // If you have French version
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function Home() {
  return (<>
    <GuestLayout>
      <Hero />
      <Consultation />
      <Services />
      <Video />
      <DiabeteProgram />
      <Blogs />
      <Partenership />
    </GuestLayout>
  </>);
}
