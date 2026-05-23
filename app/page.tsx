import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Portfolio } from "@/components/sections/Portfolio";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";
import { MusicPlayer } from "@/components/ui/MusicPlayer";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen selection:bg-white/30 selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Stats />
      <Services />
      <Contact />
      <MusicPlayer />
    </main>
  );
}
