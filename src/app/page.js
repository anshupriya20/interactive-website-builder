import Navbar from "./components/LandingPages/Navbar";
import Hero from "./components/LandingPages/Hero";
// import Features from "@/components/landing/Features";
// import CTA from "@/components/landing/CTA";
// import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      {/* <Features />
      <CTA />
      <Footer /> */}
    </main>
  );
}
