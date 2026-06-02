"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
    const features = [
        {
            icon: "🎨",
            title: "Visual Editing",
            desc: "Build pages visually without touching code. What you see is exactly what you get.",
            accent: "from-indigo-500/10 to-violet-500/5",
            border: "hover:border-indigo-500/40",
        },
        {
            icon: "🔁",
            title: "Reusable Components",
            desc: "Create once, reuse everywhere. Build a library of components across all your projects.",
            accent: "from-violet-500/10 to-pink-500/5",
            border: "hover:border-violet-500/40",
        },
        {
            icon: "📱",
            title: "Responsive Design",
            desc: "Perfect pixel-precise layouts on desktop, tablet, and mobile automatically.",
            accent: "from-cyan-500/10 to-indigo-500/5",
            border: "hover:border-cyan-500/40",
        },
        {
            icon: "✨",
            title: "AI Layout Generator",
            desc: "Generate entire page sections from a simple text prompt in seconds.",
            accent: "from-amber-500/10 to-orange-500/5",
            border: "hover:border-amber-500/40",
        },
    ];

    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            gsap.from(".features-badge", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: ".features-header",
                    start: "top 80%",
                    toggleActions: "play reverse play reverse",
                },
            });

            gsap.from(".feature-word", {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: ".features-title",
                    start: "top 80%",
                    toggleActions: "play reverse play reverse",
                },
            });

            gsap.from(".features-desc", {
                y: 30,
                opacity: 0,
                duration: 0.8,
                // delay: 0.2,

                scrollTrigger: {
                    trigger: ".features-desc",
                    start: "top 80%",
                    toggleActions: "play reverse play reverse",
                },
            });

            const cards = gsap.utils.toArray(".feature-card");

            cards.forEach((card, index) => {
                gsap.from(card, {
                    x: index % 2 === 0 ? -220 : 220,
                    // rotate: index % 2 === 0 ? -2 : 2,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play reverse play reverse",
                    },
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-24 px-6" ref={sectionRef}
        >
            <div className="mx-auto max-w-6xl">

                {/* Heading */}
                <div className="features-header text-center mb-16">
                    <p className="features-badge text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-3">
                        Features
                    </p>

                    <h2 className="features-title text-3xl md:text-5xl font-bold leading-tight">
                        {"Everything You Need to Build Something Beautiful"
                            .split(" ")
                            .map((word, index) => (
                                <span
                                    key={index}
                                    className="feature-word inline-block mr-3"
                                >
                                    {word}
                                </span>
                            ))}
                    </h2>

                    <p className="features-desc mt-5 text-zinc-400 max-w-2xl mx-auto">
                        Powerful tools designed to help creators, agencies and startups
                        launch modern websites faster than ever.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {features.map(({ icon, title, desc, accent, border }) => (
                        <div
                            key={title}
                            className={`feature-card group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br ${accent} p-6 transition-all duration-300 ${border} hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/5`}
                        >
                            {/* Glow Effect */}
                            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

                            {/* Icon */}
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/80 text-2xl transition-all duration-300 group-hover:bg-zinc-700">
                                {icon}
                            </div>

                            {/* Title */}
                            <h3 className="mb-3 font-semibold text-lg">
                                {title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {desc}
                            </p>

                            {/* Bottom Accent */}
                            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-indigo-500 transition-all duration-500 group-hover:w-full" />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}