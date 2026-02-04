"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FaqItem {
    id: string;
    question: string;
    answer: React.ReactNode;
}

interface FaqAccordionProps {
    items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
    const [openId, setOpenId] = useState<string | null>(null);

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpenId(null);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="w-full space-y-4">
            {items.map((item) => (
                <AccordionItem
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() => toggle(item.id)}
                />
            ))}
        </div>
    );
}

function AccordionItem({
    item,
    isOpen,
    onToggle,
}: {
    item: FaqItem;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div
            className={`group rounded-xl border transition-all duration-300 ${isOpen
                    ? "bg-[#3A2A1F]/40 border-[rgba(181,154,90,0.5)] shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                    : "bg-[#3A2A1F]/35 border-[rgba(181,154,90,0.18)] hover:border-[rgba(181,154,90,0.35)] hover:bg-[#3A2A1F]/40"
                } backdrop-blur-md overflow-hidden`}
        >
            {/* Header / Question */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-1 focus:ring-gold-soft/50 rounded-xl"
                aria-expanded={isOpen}
            >
                <div className="flex items-start gap-4 pr-4">
                    <span className="text-gold-antique font-bold opacity-80 mt-0.5 text-sm sm:text-base">Q.</span>
                    <span
                        className={`text-base sm:text-lg font-medium tracking-wide transition-colors duration-300 ${isOpen ? "text-gold-active" : "text-white-main group-hover:text-white-soft"
                            }`}
                    >
                        {item.question}
                    </span>
                </div>

                {/* Chevron Icon */}
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`flex-shrink-0 opacity-70 ${isOpen ? "text-gold-active" : "text-gold-soft"}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </motion.div>
            </button>

            {/* Body / Answer */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-8 pt-0">
                            <div className="pl-6 border-l border-gold-soft/30 py-2 bg-[#3A2A1F]/20 rounded-r-lg">
                                <div className="text-sm sm:text-base text-white-muted leading-loose break-keep flex gap-3">
                                    <span className="text-gold-antique font-bold shrink-0">A.</span>
                                    <span>{item.answer}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
