import Blogs from "./components/sections/blogs";
import Consultation from "./components/sections/consultation";
import DiabeteProgram from "./components/sections/diabete-program";
import Hero from "./components/sections/hero";
import Partenership from "./components/sections/partenership";
import Services from "./components/sections/services";
import Testimonies from "./components/sections/testimonies";
import Video from "./components/sections/video";

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
