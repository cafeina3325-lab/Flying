"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    GENRES,
    Genre,
    GENRE_DESCRIPTIONS,
    NAV_LINKS, // Added import
} from "@/app/constants";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function MobileMenu() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<'genre' | 'gallery' | null>(null);

    // Get Active Genre for highlighting
    const activeGenre = (searchParams.get("genre") as Genre) || null;

    // Navigation Helper
    const handleNavigation = (path: string) => {
        router.push(path);
        setIsMobileMenuOpen(false);
    };

    // Animation Variants
    const menuVariants: Variants = {
        closed: {
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 25,
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        },
        exit: {
            x: "100%",
            transition: { ease: "easeInOut", duration: 0.3 }
        }
    };

    const itemVariants: Variants = {
        closed: { opacity: 0, x: 40 },
        open: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        }
    };

    // Close menu when pathname changes (route transition)
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname, searchParams]); // Close on param change too

    return (
        <>
            {/* MOBILE: Hamburger Button (Fixed Top-Right) - Visible only on mobile */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-6 right-6 z-[10000] p-2 bg-black-deep/50 backdrop-blur-md rounded-full border border-white/10 text-white-main shadow-lg"
                aria-label="Toggle Menu"
            >
                {isMobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                )}
            </button>

            {/* MOBILE: Overlay Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 z-[9999] h-screen w-screen overflow-hidden"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Right Drawer - Width 2/5 (40%) per user request */}
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="exit"
                            className="absolute right-0 top-0 bottom-0 w-2/5 bg-[#1a120b]/95 backdrop-blur-2xl px-6 pb-8 pt-32 overflow-y-auto shadow-[-40px_0_80px_rgba(0,0,0,0.8)] z-50 flex flex-col"
                        >

                            <nav className="flex flex-col space-y-8 text-right pr-2">
                                {NAV_LINKS.map((link) => {
                                    // Special Case: Gallery
                                    if (link.label === "Gallery") {
                                        return (
                                            <motion.div key={link.label} variants={itemVariants} className="flex flex-col items-end">
                                                <button
                                                    onClick={() => setExpandedMenu(expandedMenu === 'gallery' ? null : 'gallery')}
                                                    className="text-2xl font-black uppercase tracking-tighter text-white-muted hover:text-white-main transition-all hover:tracking-wide mb-4 flex items-center gap-4 group justify-end w-full"
                                                >
                                                    {link.label}
                                                </button>
                                                <AnimatePresence>
                                                    {expandedMenu === 'gallery' && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden flex flex-col space-y-4 pr-4 border-r-2 border-soft/30"
                                                        >
                                                            <button
                                                                onClick={() => handleNavigation("/gallery?tab=event")}
                                                                className="text-right text-sm font-bold uppercase tracking-widest text-white-dim hover:text-white-muted"
                                                            >
                                                                Event
                                                            </button>
                                                            <button
                                                                onClick={() => handleNavigation("/gallery?tab=portfolio")}
                                                                className="text-right text-sm font-bold uppercase tracking-widest text-white-dim hover:text-white-muted"
                                                            >
                                                                Portfolio
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    }

                                    // Special Case: Genre
                                    if (link.label === "Genre") {
                                        return (
                                            <motion.div key={link.label} variants={itemVariants} className="flex flex-col items-end">
                                                <button
                                                    onClick={() => setExpandedMenu(expandedMenu === 'genre' ? null : 'genre')}
                                                    className="text-2xl font-black uppercase tracking-tighter text-white-muted hover:text-white-main transition-all hover:tracking-wide mb-4 flex items-center gap-4 group justify-end w-full"
                                                >
                                                    {link.label}
                                                </button>
                                                <AnimatePresence>
                                                    {expandedMenu === 'genre' && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden flex flex-col space-y-4 pr-4 border-r-2 border-gold-soft/30"
                                                        >
                                                            {GENRES.map((genre) => (
                                                                <button
                                                                    key={genre}
                                                                    onClick={() => handleNavigation(`/genre?genre=${genre}`)}
                                                                    className={`text-right text-sm font-bold uppercase tracking-widest transition-all ${activeGenre === genre
                                                                        ? "text-gold-antique"
                                                                        : "text-white-dim hover:text-white-muted"
                                                                        }`}
                                                                >
                                                                    {GENRE_DESCRIPTIONS[genre].title}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        );
                                    }

                                    // Default Link
                                    return (
                                        <motion.div key={link.label} variants={itemVariants} className="border-b border-white/10 pb-4">
                                            <button
                                                onClick={() => handleNavigation(link.href)}
                                                className="text-2xl font-black uppercase tracking-tighter text-white-muted hover:text-white-main transition-all hover:tracking-wide"
                                            >
                                                {link.label}
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
