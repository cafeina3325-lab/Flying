"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
}

interface MilkyWayEffectProps {
    isVisible: boolean;
}

export default function MilkyWayEffect({ isVisible }: MilkyWayEffectProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const animationFrameId = useRef<number>(0);
    const mousePos = useRef({ x: 0, y: 0 });
    const isMoving = useRef(false);
    const lastMoveTime = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Resize handler
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);
        handleResize();

        // Mouse movement tracker
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            isMoving.current = true;
            lastMoveTime.current = Date.now();
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Animation Loop
        const render = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Spawn particles if moving and visible
            if (isVisible && isMoving.current) {
                // Stop spawning if mouse stopped moving for 100ms
                if (Date.now() - lastMoveTime.current > 100) {
                    isMoving.current = false;
                }

                // Spawn multiple particles for dense "Milky Way" look
                const spawnCount = 2;
                for (let i = 0; i < spawnCount; i++) {
                    particles.current.push({
                        x: mousePos.current.x + (Math.random() - 0.5) * 20, // Spread slightly
                        y: mousePos.current.y + (Math.random() - 0.5) * 20,
                        vx: (Math.random() - 0.5) * 0.5, // Slow drift
                        vy: (Math.random() - 0.5) * 0.5,
                        size: Math.random() * 2 + 0.5, // Tiny stars
                        alpha: 1,
                        // Random mix of white, faint gold, fainter blue
                        color:
                            Math.random() > 0.8
                                ? "255, 255, 255" // White
                                : Math.random() > 0.5
                                    ? "181, 154, 90" // Gold (#b59a5a)
                                    : "200, 200, 255", // Blue-ish
                    });
                }
            }

            // 2. Update & Draw Particles
            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i];

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Fade out
                p.alpha -= 0.005 + Math.random() * 0.01; // Random fade speed

                // Draw
                if (p.alpha <= 0) {
                    particles.current.splice(i, 1);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                    ctx.fill();
                }
            }

            animationFrameId.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [isVisible]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-[9990] transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
        />
    );
}
