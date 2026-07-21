"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// ==========================ICONS============================================
import {
    FolderPlus,
    Blocks,
    PencilRuler,
    Rocket,
} from "lucide-react";
import { Play } from 'lucide-react';
import { Menu } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Coffee } from 'lucide-react';
import { Palette } from 'lucide-react';

// =====================================COMPONENTS=======================================
import Features from "./Features";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    useEffect(() => {
        // Hero text reveal
        gsap.fromTo(
            ".hero-badge",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
        );
        gsap.fromTo(
            ".hero-title",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.4 }
        );
        gsap.fromTo(
            ".hero-sub",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.65 }
        );
        gsap.fromTo(
            ".hero-btns",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.85 }
        );
        gsap.fromTo(
            ".hero-preview",
            { opacity: 0, y: 60, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", delay: 1.05 }
        );

        // Scroll-triggered sections
        gsap.utils.toArray(".scroll-reveal").forEach((el) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                    },
                }
            );
        });
    }, []);

    const processSteps = [
        {
            id: "01",
            title: "Create Project",
            icon: <Rocket />,
            description:
                "Start by creating a new website project and selecting a base template.",
        },
        {
            id: "02",
            title: "Add Components",
            icon: <FolderPlus />,
            description:
                "Drag and drop reusable components to quickly build your layout.",
        },
        {
            id: "03",
            title: "Customize Design",
            icon: <PencilRuler />,
            description:
                "Edit content, colors, spacing and typography visually.",
        },
        {
            id: "04",
            title: "Publish Website",
            icon: <Blocks />,
            description:
                "Deploy your website instantly with one click.",
        },
    ];



    return (
        <main>
            {/* ── HERO ────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-28 px-6">
                {/* ambient glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                    <div className="h-[600px] w-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />
                </div>

                <div className="relative mx-auto max-w-4xl flex flex-col items-center text-center gap-6">
                    <span className="hero-badge inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium tracking-widest text-indigo-400 uppercase">
                        <Sparkles /> AI-Powered Website Builder
                    </span>

                    <h1 className="hero-title text-5xl md:text-7xl font-bold tracking-tight leading-[1.08]">
                        Build Websites<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-violet-400 to-pink-400">
                            That Feel Crafted,
                        </span>
                        <br />Not Generated.
                    </h1>

                    <p className="hero-sub max-w-xl text-lg text-zinc-400 leading-relaxed">
                        Design stunning websites with drag-and-drop simplicity, AI-assisted
                        layouts, responsive components, and modern templates.
                    </p>

                    <div className="hero-btns flex flex-wrap gap-4 justify-center">
                        <button className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20">
                            Start Building Free
                        </button>
                        <button className="group flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/15 transition-colors">
                                <Play />
                            </span>
                            Watch Demo
                        </button>
                    </div>
                </div>

                {/* ── App Preview ───────────────────────────── */}
                <div className="hero-preview relative mx-auto mt-12 md:mt-16 max-w-[95vw] lg:max-w-6xl rounded-2xl border border-zinc-800 bg-zinc-950/80 overflow-hidden shadow-2xl shadow-black/50">
                    {/* Browser Header */}
                    <div className="flex items-center gap-2 border-b border-zinc-800 px-4 md:px-5 py-3 bg-zinc-900/80">
                        <span className="h-3 w-3 rounded-full bg-red-500/80" />
                        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                        <span className="h-3 w-3 rounded-full bg-green-500/80" />

                        <div className="ml-2 md:ml-4 flex-1 rounded-md bg-zinc-800 h-6 max-w-xs" />
                    </div>


                    {/* Builder Layout */}
                    <div className="flex flex-col md:flex-row lg:flex-row min-h-[280px] sm:min-h-[350px] md:min-h-[420px] lg:h-[500px]">
                        {/* Components Sidebar */}
                        <aside
                            className=" hidden md:block md:w-52 lg:w-60  shrink-0 border-r border-zinc-800 bg-zinc-900/60 p-3 "
                        >
                            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                                Components
                            </p>

                            <div className="flex flex-col gap-2">
                                {[
                                    "Hero Section",
                                    "Features Grid",
                                    "Pricing Table",
                                    "Testimonials",
                                    "CTA Banner",
                                    "Footer",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="  flex items-center gap-2 rounded-lg  px-3 py-2 text-xs text-zinc-400  hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer transition-colors "
                                    >
                                        <span className="h-4 w-4 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[9px]">
                                            ■
                                        </span>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </aside>

                        {/* Canvas */}
                        <div
                            className=" flex-1 bg-[#0d0d0d]  p-2 sm:p-3 md:p-4 relative "
                        >
                            <div
                                className=" h-full min-h-[260px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-full rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center relative  overflow-hidden "
                            >
                                {/* Mini Website Preview */}
                                <div
                                    className=" w-[90%] max-w-[220px] sm:max-w-[300px] md:max-w-[420px] space-y-3 "
                                >
                                    {/* Badge */}
                                    <div className="h-2 w-20 rounded-full bg-indigo-500/40" />

                                    {/* Heading */}
                                    <div className="h-6 w-3/4 rounded bg-zinc-700/60" />

                                    {/* Description */}
                                    <div className="h-3 w-full rounded bg-zinc-800" />
                                    <div className="h-3 w-5/6 rounded bg-zinc-800" />

                                    {/* Buttons */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <div className="h-8 w-24 rounded-lg bg-indigo-600/60" />
                                        <div className="h-8 w-24 rounded-lg bg-zinc-800" />
                                    </div>

                                    {/* Feature Cards */}
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className=" h-12 sm:h-14 md:h-16 rounded-lg bg-zinc-800/80 "
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Selected Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded-md font-medium">
                                        Selected
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Properties Panel */}
                        <aside
                            className=" hidden lg:block lg:w-60 shrink-0 border-l border-zinc-800 bg-zinc-900/60 p-3"
                        >
                            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                                Properties
                            </p>

                            {[
                                ["Width", "100%"],
                                ["Padding", "64px"],
                                ["Font Size", "48px"],
                                ["Color", "#6366F1"],
                            ].map(([k, v]) => (
                                <div key={k} className="mb-3">
                                    <p className="text-[10px] text-zinc-500 mb-1">
                                        {k}
                                    </p>

                                    <div className="rounded-md bg-zinc-800 px-2 py-2 text-xs text-zinc-300">
                                        {v}
                                    </div>
                                </div>
                            ))}
                        </aside>
                    </div>
                </div>
            </section>

            {/* ── SOCIAL PROOF ─────────────────────────────────── */}
            <section className="scroll-reveal py-10 border-y border-zinc-800/60">
                <div className="mx-auto max-w-4xl px-6">
                    <p className="text-center text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-6">
                        Trusted by creators worldwide
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {["Freelancers", "Startups", "Agencies", "Creators", "Developers"].map((label) => (
                            <span
                                key={label}
                                className="px-5 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 font-medium"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ─────────────────────────────────────── */}
            <section className="scroll-reveal py-24 px-6">
                <Features />
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────── */}
            <section className="scroll-reveal py-24 px-6 bg-zinc-950/60">
                <div className="mx-auto max-w-7xl">

                    <div className="text-center mb-16">
                        <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-3">
                            Process
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold">
                            How CraftSite Works
                        </h2>

                        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
                            Build, customize and launch professional websites in just a few simple steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">

                        {/* Connector Line */}
                        <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

                        {processSteps.map((items) => (
                            <div
                                key={items.id}
                                className="group perspective h-72"
                            >
                                <div
                                    className="relative h-full w-full duration-700 transition-transform will-change-transform  [transform-style:preserve-3d]  group-hover:[transform:rotateY(180deg)]"
                                >

                                    {/* Front */}
                                    <div
                                        className=" absolute  inset-0 rounded-2xl  border  border-zinc-800  bg-zinc-900/40  backdrop-blur-sm  flex  flex-col   items-center  justify-center  gap-4  [backface-visibility:hidden] "
                                    >
                                        <div
                                            className=" flex  h-16 w-16  items-center  justify-center  rounded-2xl  bg-zinc-800  text-3xl  transition-colors   duration-300   group-hover:bg-indigo-500/20 "
                                        >
                                            {items.icon}
                                        </div>

                                        <span className="text-xs font-bold text-zinc-600">
                                            {items.id}
                                        </span>

                                        <h3 className="font-semibold text-lg">
                                            {items.title}
                                        </h3>
                                    </div>

                                    {/* Back */}
                                    <div
                                        className="  absolute  inset-0 rounded-2xl  border border-indigo-500/30  bg-gradient-to-br from-indigo-600/20  to-purple-600/20  p-6  flex  flex-col  justify-center  [transform:rotateY(180deg)]    [backface-visibility:hidden]  "
                                    >
                                        <span className="text-indigo-400 font-bold mb-3">
                                            Step {items.id}
                                        </span>

                                        <h3 className="font-semibold text-xl mb-4">
                                            {items.title}
                                        </h3>

                                        <p className="text-zinc-300 text-sm leading-relaxed">
                                            {items.description}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* ── TEMPLATES ────────────────────────────────────── */}
            <section className="scroll-reveal py-24 px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-3">Templates</p>
                        <h2 className="text-3xl md:text-4xl font-bold">Launch Faster with<br />Stunning Starter Templates</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { name: "Personal Portfolio", tag: "Creative", color: "from-violet-600/20 to-indigo-600/10", icon: <Palette size={50} className="text-blue-400/20" /> },
                            { name: "Restaurant & Café", tag: "Business", color: "from-amber-600/20 to-orange-600/10", icon: <Coffee size={50} className="text-amber-400/20" /> },
                            { name: "Startup Landing", tag: "SaaS", color: "from-indigo-600/20 to-cyan-600/10", icon: "⚡" },
                            { name: "Creative Agency", tag: "Agency", color: "from-pink-600/20 to-rose-600/10", icon: <Sparkles size={50} className="text-indigo-400" /> },
                        ].map(({ name, tag, color, icon }) => (
                            <div
                                key={name}
                                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition-all duration-300 cursor-pointer"
                            >
                                <div className={`h-44 bg-gradient-to-br ${color} flex items-center justify-center text-5xl`}>
                                    {icon}
                                </div>
                                <div className="p-4">
                                    <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">{tag}</span>
                                    <h3 className="mt-1 font-semibold text-sm">{name}</h3>
                                    <button className="mt-3 text-xs text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors">
                                        Use Template →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────── */}
            <section className="scroll-reveal py-24 px-6">
                <div className="mx-auto max-w-3xl relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-800/50 to-violet-900/40 p-12 text-center shadow-2xl shadow-indigo-900/40">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                    >
                        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-violet-400/10 blur-3xl" />
                    </div>
                    <div className="relative">
                        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-200 mb-4">Get Started Today</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Launch Your<br />Next Website?</h2>
                        <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
                            Join thousands of creators, startups and agencies building beautiful websites with CraftSite.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {/* <button className="bg-white text-indigo-700 hover:bg-indigo-50 active:scale-95 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg">
                                Start Building Free
                            </button> */}
                            <Link
                                href="/builder"
                                className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 inline-flex items-center justify-center"
                            >
                                Start Building Free
                            </Link>
                            <button className="border border-white/30 text-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all">
                                See All Templates
                            </button>
                        </div>
                        <p className="mt-6 text-xs text-indigo-300">No credit card required · Free forever plan available</p>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <Footer />
        </main>
    );
}