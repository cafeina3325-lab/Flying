"use client";

import { useEffect, useRef } from "react";

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
}

interface TwinklingStarsProps {
    isActive: boolean;
}

export default function TwinklingStars({ isActive }: TwinklingStarsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const animationFrameId = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Initialize stars
        const initStars = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Increased density: / 6000 instead of / 10000
            const starCount = Math.floor((width * height) / 6000);
            const stars: Star[] = [];

            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 3 + 2, // 2px to 5px (Even Larger)
                    opacity: Math.random() * 0.8 + 0.2, // Min opacity 0.2
                    speed: Math.random() * 0.02 + 0.005,
                });
            }
            starsRef.current = stars;
        };

        const handleResize = () => {
            initStars();
        };

        window.addEventListener("resize", handleResize);
        initStars();

        const render = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            starsRef.current.forEach((star, index) => {
                // Twinkle logic
                star.opacity += star.speed;
                if (star.opacity > 1 || star.opacity < 0.2) {
                    star.speed = -star.speed;
                }

                // Minimum 0.5 opacity for guaranteed visibility for now
                const visibleOpacity = Math.max(0.5, Math.min(1, star.opacity));

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

                // Mix Gold and White stars
                // 40% Gold (#D6BE8A), 60% White
                if (index % 5 < 2) {
                    ctx.fillStyle = `rgba(214, 190, 138, ${visibleOpacity})`;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = "rgba(214, 190, 138, 0.8)";
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${visibleOpacity})`;
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
                }

                ctx.fill();
            });

            animationFrameId.current = requestAnimationFrame(render);
        };

        // Always render loop, control visibility via CSS class opacity
        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000 ${isActive ? "opacity-100" : "opacity-0"
                }`}
        />
    );
}
