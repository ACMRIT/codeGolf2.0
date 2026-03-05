import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Format from "@/components/Format";
import Rules from "@/components/Rules";
import Schedule from "@/components/Schedule";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-[#060914] min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Format />
      <Rules />
      <Schedule />
      <Footer />
    </main>
  );
}
