import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../sections/Hero";
import Marquee from "../sections/Marquee";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Experience from "../sections/Experience";
import Projects from "../sections/Projects";
import Achievements from "../sections/Achievements";
import Footer from "../sections/Footer";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const t = setTimeout(() => {
      const el = document.getElementById(target);
      if (!el) return;
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72, immediate: true });
      else el.scrollIntoView();
    }, 80);
    return () => clearTimeout(t);
  }, [location.state]);

  return (
    <main data-testid="home-page">
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Achievements />
      <Footer />
    </main>
  );
}
