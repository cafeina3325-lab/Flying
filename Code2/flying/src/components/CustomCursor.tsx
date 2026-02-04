"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface CustomCursorProps {
    isActive: boolean; // Only visible when true (Sections C-E)
}

export default function CustomCursor({ isActive }: CustomCursorProps) {
    const [isPointer, setIsPointer] = useState(false);

    // Physics for smooth movement
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16); // Center the 32px cursor
            cursorY.set(e.clientY - 16);

            // Check if hovering a clickable element
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button');

            setIsPointer(!!isClickable);
        };

        if (isActive) {
            window.addEventListener("mousemove", moveCursor);
        }

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, [isActive, cursorX, cursorY]);

    // If not active or touch device (handled by media query in css typically, 
    // but here we can just hide it if not active)
    if (!isActive) return null;

    return (
        <>
            <style jsx global>{`
        @media (pointer: fine) {
          /* Hide default cursor only when active zone */
          body.cursor-active, body.cursor-active a, body.cursor-active button {
            cursor: none;
          }
        }
      `}</style>

            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/40 bg-white/5 backdrop-blur-[1px] pointer-events-none z-[9999] mix-blend-difference hidden md:block" // Hidden on mobile via CSS
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    scale: isPointer ? 1.5 : 1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />
            {/* Subtle trail dot */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 rounded-full bg-gold-antique pointer-events-none z-[9998] opacity-60 hidden md:block"
                style={{
                    x: cursorX, // No spring, follows instantly (or different spring)
                    y: cursorY,
                    translateX: 12, // Center in 32px parent (16) - 1/2 size (1) = 15? No, 32/2=16. 2/2=1. 16-1=15.
                    translateY: 12
                }}
            />
        </>
    );
}
