// "use client";

// import { useEffect, useRef } from "react";
// import {gsap} from "gsap";

// export default function Navbar() {
//     const textRef = useRef(null);


//     useEffect(() => {
//         const tl = gsap.timeline();

//         tl.from(".logo", {
//             x: -50,
//             opacity: 0,
//             duration: 0.8,
//         })
//             .from(
//                 ".nav-link",
//                 {
//                     y: -20,
//                     opacity: 0,
//                     stagger: 0.1,
//                     duration: 0.5,
//                 },
//                 "-=0.4"
//             )
//             .from(
//                 ".nav-btn",
//                 {
//                     scale: 0,
//                     opacity: 0,
//                     duration: 0.4,
//                 },
//                 "-=0.3"
//             );
//     }, []);



//     return (
//         <nav className="border-b border-neutral-800" >
//             <div className=" px-6 h-20 flex items-center justify-between">
//                 <h1 className="logo text-2xl font-bold text-left">
//                     CraftSite
//                 </h1>
//                 <div className="hidden md:flex gap-8">
//                     <a href="#" className="nav-link">Features</a>
//                     <a href="#" className="nav-link">Templates</a>
//                     <a href="#" className="nav-link">Showcase</a>
//                     <a href="#" className="nav-link">Pricing</a>
//                     <a href="#" className="nav-link">Resources</a>
//                 </div>

//                 <div className="flex flex-row gap-3">
//                     <button className="nav-btn bg-[#0A0A0A] border border-[#262626] text-[#FFFFFF] p-2 rounded-lg font-medium">
//                         Sign In
//                     </button>
//                     <button className="nav-btn bg-[#0A0A0A] border border-[#262626] text-[#FFFFFF] p-2 rounded-lg font-medium">
//                         Get Started
//                     </button>
//                 </div>
//             </div>
//         </nav>
//     )
// }

"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl shadow-lg shadow-black/20"
                : "border-b border-transparent bg-transparent"
                }`}
        >
   

            <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
                <h1 className="nav-logo text-xl font-bold tracking-tight">
                    Craft<span className="text-indigo-400">Site</span>
                </h1>

                <div className="hidden md:flex items-center gap-1">
                    {["Features", "Templates", "Showcase", "Pricing", "Resources"].map((item, i) => (
                        <a
                            key={item}
                            href="#"
                            style={{ animationDelay: `${0.1 + i * 0.07}s` }}
                            className="nav-link-item px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        style={{ animationDelay: "0.45s" }}
                        className="nav-btn-item px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        style={{ animationDelay: "0.52s" }}
                        className="nav-btn-item bg-indigo-600 hover:bg-indigo-500 active:scale-95 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-indigo-500/20"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
}