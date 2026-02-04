"use client";

import { useEffect, useRef } from "react";

export default function GlitchNoiseEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameId = useRef<number>(0);
    // Track mouse intensity
    const intensity = useRef(0);
    const targetIntensity = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener("resize", resize);
        resize();

        // Mouse interaction
        const onMouseMove = () => {
            targetIntensity.current = 1.0; // Max glitch on move
            // Debounce/Decay logic handled in loop
        };
        // Reset when stopped moving? Or just decay naturally.
        window.addEventListener("mousemove", onMouseMove);


        const render = () => {
            // Decay intensity
            targetIntensity.current *= 0.9;
            intensity.current += (targetIntensity.current - intensity.current) * 0.1;

            ctx.clearRect(0, 0, width, height);

            // 1. Base Static Noise (Always present, low opacity)
            // Optimization: Draw random pixels? Or just fillRect with patterns.
            // Drawing direct pixels is slow. Better: use noise image or just random rects.
            // Let's draw random grey rects for "texture"


            const isGlitching = intensity.current > 0.05;

            // Draw noise layer
            // Every few frames, update noise


            // LIGHTWEIGHT NOISE: Draw random small rectangles
            const noiseCount = isGlitching ? 50 : 10;
            for (let i = 0; i < noiseCount; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const w = Math.random() * 2 + 1;
                const h = Math.random() * 2 + 1;
                const grey = Math.floor(Math.random() * 50); // Dark noise
                ctx.fillStyle = `rgba(${grey},${grey},${grey},0.1)`;
                ctx.fillRect(x, y, w, h);
            }

            // 2. GLITCH EFFECT (High Intencity)
            if (isGlitching) {
                const glitchStrength = intensity.current; // 0 to 1

                // Horizontal Tearing
                const tearCount = Math.floor(Math.random() * 5 * glitchStrength);
                for (let i = 0; i < tearCount; i++) {
                    const y = Math.random() * height;
                    const h = Math.random() * 50 + 5;
                    // Draw a shifted slice? 
                    // Hard to copy self without image.
                    // Just draw colored strips.

                    // RGB Shift
                    const offset = Math.random() * 20 * glitchStrength;
                    if (Math.random() > 0.5) {
                        ctx.fillStyle = `rgba(255,0,0,${0.2 * glitchStrength})`;
                        ctx.fillRect(0 - offset, y, width + offset, h);
                    } else {
                        ctx.fillStyle = `rgba(0,255,255,${0.2 * glitchStrength})`;
                        ctx.fillRect(0 + offset, y, width - offset, h);
                    }

                    // White/Black bars
                    if (Math.random() > 0.8) {
                        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.5)";
                        ctx.fillRect(0, y, width, Math.random() * 2);
                    }
                }
            }

            // Textual Glitch ? No, just background content.

            frameId.current = requestAnimationFrame(render);
        };
        render();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(frameId.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 mix-blend-overlay" // Use mix-blend for texture effect
            style={{ opacity: 0.6 }}
        />
    );
}
