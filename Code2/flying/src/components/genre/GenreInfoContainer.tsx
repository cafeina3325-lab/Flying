"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    GENRES,
    Genre,
    GENRE_DESCRIPTIONS,
} from "@/app/constants";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlumBlossomEffect from "../effects/PlumBlossomEffect";

export default function GenreInfoContainer() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<'genre' | 'gallery' | null>(null);

    // 1. Get Active Genre (Default to first if none)
    const activeGenre = (searchParams.get("genre") as Genre) || GENRES[0];

    const selectGenre = (genre: Genre) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("genre", genre);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Animation Variants
    // Animation Variants
    const menuVariants = {
        closed: {
            x: "100%",
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: 0,
            transition: {
                type: "spring" as const,
                stiffness: 150,
                damping: 25,
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        },
        exit: {
            x: "100%",
            transition: { ease: "easeInOut" as const, duration: 0.3 }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: 40 },
        open: {
            opacity: 1,
            x: 0,
            transition: { type: "spring" as const, stiffness: 200, damping: 20 }
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[70vh] gap-12 relative">
            {/* BACKGROUND EFFECT: Irezumi (Plum Blossoms) */}
            {activeGenre === 'irezumi' && <PlumBlossomEffect />}

            {/* Local Mobile Menu Removed - Using Global MobileMenu in Layout */}

            {/* DESKTOP SIDEBAR: Navigation (Desktop Only) */}
            <aside className="hidden md:block w-64 flex-shrink-0">
                <nav className="sticky top-8 flex flex-col space-y-2 border-l border-soft ml-2">
                    {GENRES.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => selectGenre(genre)}
                            className={`text-left px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all border-l-2 -ml-[1px] ${activeGenre === genre
                                ? "border-gold-antique text-gold-antique pl-8"
                                : "border-transparent text-white-dim hover:text-white-muted hover:pl-8"
                                }`}
                        >
                            {GENRE_DESCRIPTIONS[genre].title}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* CONTENT: Information */}
            <div className="flex-1 space-y-12 relative z-10">
                {/* Header */}
                <header>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white-main mb-8 md:mb-12 border-b-4 border-gold-antique inline-block pb-2">
                        {GENRE_DESCRIPTIONS[activeGenre].title}
                    </h2>

                    {/* Styled Description Container */}
                    <div className="space-y-12 md:space-y-20">
                        {GENRE_DESCRIPTIONS[activeGenre].description.split("\n\n").map((block, i) => {
                            const trimmedBlock = block.trim();

                            // 1. First Block (Intro) -> Hero Text
                            // We assume the first block is the general introduction
                            if (i === 0) {
                                return (
                                    <div key={i} className="max-w-4xl">
                                        <p className="text-base md:text-lg lg:text-xl font-medium text-white-soft leading-relaxed md:leading-loose text-left break-keep">
                                            {trimmedBlock}
                                        </p>
                                    </div>
                                );
                            }

                            // 2. Main Section Headers (e.g., "1. 블랙워크의 기원") 
                            // Render as a Major Section Divider
                            if (/^\d+\./.test(trimmedBlock)) {
                                return (
                                    <div key={i} className="pt-8 md:pt-16 border-t border-[rgba(181,154,90,0.18)]">
                                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-gold-antique mb-6 md:mb-8 tracking-tight text-left break-keep relative inline-block">
                                            {trimmedBlock}
                                            {/* Subtle brown underlay for heading */}
                                            <span className="absolute -inset-2 -z-10 bg-[#3A2A1F]/10 rounded-lg blur-sm"></span>
                                        </h3>
                                    </div>
                                );
                            }

                            // 3. Sub-headers or Content Blocks
                            // Detect if this block contains multiple "Key: Value" pairs to render as a GRID
                            const lines = trimmedBlock.split("\n");
                            const isFeatureList = lines.some(line => line.includes(":") && line.length < 100);

                            if (isFeatureList) {
                                return (
                                    <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        {lines.map((line, j) => {
                                            const trimmedLine = line.trim();

                                            // Feature Card (Key: Value)
                                            if (trimmedLine.includes(":")) {
                                                const [key, val] = trimmedLine.split(":");
                                                if (val) {
                                                    return (
                                                        <div key={j} className="bg-[linear-gradient(135deg,rgba(58,42,31,0.55),rgba(15,31,26,0.55))] border border-[rgba(181,154,90,0.18)] p-6 md:p-8 rounded-lg hover:border-gold-soft transition-colors shadow-lg">
                                                            <h4 className="text-gold-soft font-bold text-sm md:text-base mb-2 text-left break-keep">{key.trim()}</h4>
                                                            <p className="text-white-muted text-xs md:text-sm leading-relaxed text-left break-keep">{val.trim()}</p>
                                                        </div>
                                                    )
                                                }
                                            }

                                            // Sub-header within list
                                            if (/^[^:]+$/.test(trimmedLine) && trimmedLine.length < 40 && !trimmedLine.endsWith(".")) {
                                                return <h4 key={j} className="col-span-1 md:col-span-2 text-lg font-bold text-white-main mt-4 mb-2 text-left break-keep">{trimmedLine}</h4>;
                                            }

                                            // Fallback for regular lines mixed in
                                            return <p key={j} className="col-span-1 md:col-span-2 text-white-muted text-left break-keep">{trimmedLine}</p>;
                                        })}
                                    </div>
                                );
                            }

                            // 4. Standard Text Block (Narrative)
                            // Render as a "Note" or standard readable paragraph
                            return (
                                <div key={i} className="max-w-3xl pl-0 md:pl-6 border-l-0 md:border-l-2 border-soft">
                                    {lines.map((line, j) => {
                                        const trimmedLine = line.trim();
                                        // Simple headers inside text
                                        if (trimmedLine.length < 40 && !trimmedLine.endsWith(".") && !trimmedLine.includes(" ")) {
                                            return <h4 key={j} className="text-base font-bold text-white-main mb-3 mt-4 text-left break-keep">{trimmedLine}</h4>;
                                        }
                                        return <p key={j} className="text-sm md:text-base text-white-muted leading-8 mb-4 text-left break-keep">{trimmedLine}</p>;
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </header>
            </div>

        </div >

    );
}
