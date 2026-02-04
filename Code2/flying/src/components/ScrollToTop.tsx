"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { usePathname } from "next/navigation";

export default function ScrollToTop() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            let threshold = 300;

            // On main page, show only after Section C (User Requirement)
            if (pathname === "/") {
                const sectionC = document.getElementById("section-c");
                if (sectionC) {
                    // Robust calculation: absolute position of Section C
                    const rect = sectionC.getBoundingClientRect();
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const absoluteTop = rect.top + scrollTop;

                    // Show when Section C is entering the viewport (e.g., when we've scrolled past most of the previous section)
                    // Trigger: When top of Section C is within 80% of viewport height from bottom
                    threshold = absoluteTop - (window.innerHeight * 0.8);
                } else {
                    // Fallback: Show after 1.5 screeens if Section C is missing
                    threshold = window.innerHeight * 1.5;
                }
            }

            if (window.scrollY > threshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        // Trigger once on mount/path change to set initial state
        toggleVisibility();

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [pathname]);

    // Scroll directly to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-[20000] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-gold-antique hover:text-white-main transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group overflow-hidden border border-white/10"
                    style={{
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
                    }}
                    aria-label="Scroll to top"
                >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none rounded-full"></div>
                    {/* Tiny House Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-1 transition-transform duration-300"
                    >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
