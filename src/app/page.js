import Navbar from "./components/LandingPages/Navbar";
import Hero from "./components/LandingPages/Hero";


export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
     </main>
  );
}
