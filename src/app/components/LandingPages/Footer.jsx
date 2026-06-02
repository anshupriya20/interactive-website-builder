"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ===============================ICONS================================
import { ImLinkedin } from "react-icons/im";
import { FaXTwitter } from "react-icons/fa6";
import { ImGithub } from "react-icons/im";


gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef(null);

    const links = {
        Product: ["Features", "Templates", "Pricing", "Changelog"],
        Resources: ["Docs", "Blog", "Support", "Community"],
        Company: ["About", "Careers", "Contact", "Legal"],
    };

    useEffect(() => {
        const ctx = gsap.context(() => {

            gsap.from(".footer-brand", {
                x: -80,
                opacity: 0,
                duration: 1,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: ".footer-section",
                    start: "top 85%",
                },
            });

            gsap.from(".footer-column", {
                y: 80,
                opacity: 0,
                rotateX: -20,
                stagger: 0.15,
                duration: 1,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: ".footer-section",
                    start: "top 85%",
                },
            });

            
            gsap.from(".footer-social", {
                y: 20,
                opacity: 0,
                stagger: 0.08,
                duration: 0.6,
                ease: "power3.out",

                scrollTrigger: {
                    trigger: ".footer-section",
                    start: "top 85%",
                },
            });

            gsap.from(".footer-bottom", {
                y: 30,
                opacity: 0,
                duration: 0.8,

                scrollTrigger: {
                    trigger: ".footer-bottom",
                    start: "top 95%",
                },
            });

        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer
            ref={footerRef}
            className="footer-section relative mt-24 border-t border-zinc-800/50"
        >
            {/* Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            <div className="mx-auto max-w-7xl px-6 py-16">

                {/* Main Footer */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-12">

                    {/* Brand */}
                    <div className="footer-brand">

                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs text-zinc-500">
                                Builder is live
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight mb-4">
                            Craft<span className="text-indigo-400">Site</span>
                        </h2>

                        <p className="max-w-sm text-sm text-zinc-400 leading-relaxed">
                            Build stunning websites visually with AI-powered editing,
                            reusable components and one-click publishing.
                        </p>

                        {/* Socials */}
                        <div className="flex gap-3 mt-6">
                            <button className="footer-social flex items-center justify-center h-10 w-10 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300">
                                <FaXTwitter size={20} />
                            </button>

                            <button className="footer-social flex items-center justify-center h-10 w-10 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300">
                                <ImLinkedin size={20} />
                            </button>

                            {/* FIXED: Changed from h-15 w-15 to h-10 w-10, and icon size from 25 to 20 */}
                            <button className="footer-social flex items-center justify-center h-10 w-10 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-300">
                                <ImGithub size={20} />
                            </button>
                        </div>


                    </div>

                    {/* Newsletter */}
                    <div
                        className=" footer-column rounded-2xl  border border-zinc-800  bg-zinc-900/40 p-6"
                    >
                        <h3 className="font-semibold text-lg mb-2">
                            Stay Updated
                        </h3>

                        <p className="text-sm text-zinc-500 mb-5">
                            Product updates, templates and website builder tips.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-zinc-950  border border-zinc-800  rounded-xl  px-4  py-3  text-sm  outline-none  focus:border-indigo-500 "
                            />

                            <button
                                className="bg-indigo-600  hover:bg-indigo-500  px-5  py-3 rounded-xl  text-sm  font-medium  transition-colors"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">

                        {Object.entries(links).map(([group, items]) => (
                            <div
                                key={group}
                                className="footer-column"
                            >
                                <p
                                    className="text-xs font-semibold tracking-[0.2em] text-zinc-300 uppercase  mb-5"
                                >
                                    {group}
                                </p>

                                <ul className="space-y-3">
                                    {items.map((item) => (
                                        <li key={item}>
                                            <a
                                                href="#"
                                                className="group inline-flex items-center text-sm text-zinc-500 hover:text-white transition-all"
                                            >
                                                <span className="mr-0 transition-all group-hover:mr-2">
                                                    →
                                                </span>

                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                    </div>

                </div>

                {/* Bottom Bar */}
                <div
                    className="  footer-bottom mt-14 pt-6 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4"
                >
                    <p className="text-xs text-zinc-600">
                        © 2026 CraftSite. All rights reserved.
                    </p>

                    <p className="text-xs text-zinc-600">
                        Crafted for creators, startups and agencies.
                    </p>
                </div>

            </div>
        </footer>
    );
}