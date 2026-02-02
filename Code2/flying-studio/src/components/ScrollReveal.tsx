"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
    className?: string;
    delay?: number;
}

export default function ScrollReveal({
    children,
    width = "100%",
    className = "",
    delay = 0
}: ScrollRevealProps) {
    return (
        <div style={{ width }} className={`${className} overflow-hidden`}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }} // cubic-bezier for "easeOutQuint"ish
            >
                {children}
            </motion.div>
        </div>
    );
}
