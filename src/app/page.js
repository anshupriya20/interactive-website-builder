import Navbar from "./components/templates/Navbar";
import Hero from "./components/templates/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
    </main>
  );
}
