import { Metadata } from "next";
import Blogs from "./components/sections/blogs";
import Consultation from "./components/sections/consultation";
import DiabeteProgram from "./components/sections/diabete-program";
import Hero from "./components/sections/hero";
import Partenership from "./components/sections/partenership";
import Services from "./components/sections/services";
import Testimonies from "./components/sections/testimonies";
import Video from "./components/sections/video";

export const metadata: Metadata = {
  title: "Healthcare Solutions From all walks of Life",
  description: "Empowering Rwandans and youth globally with holistic healthcare via digital solutions. Focused on nutrition awareness and combating NCDs.",
  keywords: "Rwanda, healthcare, digital health, nutrition, NCDs, youth health, Vitaway, e-clinic, health education, healthy lifestyle",
  metadataBase: new URL("https://www.vitaway.org"),
  openGraph: {
    title: "Healthcare Solutions From all walks of Life",
    description: "Empowering Rwandans and youth globally with holistic healthcare via digital solutions. Focused on nutrition awareness and combating NCDs.",
    type: "website",
    url: "https://vitaway.com",
    images: [
      {
        url: "https://vitaway.com/images/",
        width: 1200,
        height: 630,
        alt: "Vitaway Logo",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function Home() {
  return (<>
    <Hero />
    <Consultation />
    <Services />
    <Video />
    <DiabeteProgram />
    <Testimonies />
    <Blogs />
    <Partenership />
  </>);
}
