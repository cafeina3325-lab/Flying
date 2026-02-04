"use client";

import { useEffect, useState } from "react";

export default function AmbientSmokeEffect() {
    // Check for reduced motion preference
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setReducedMotion(e.matches);
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Base Tone Overlay: Dark & Slightly Cold */}
            <div className="absolute inset-0 bg-[#0B1411]/40 mix-blend-overlay" />

            {/* If reduced motion, show a static static haze image or gradient */}
            {reducedMotion ? (
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(200,210,220,0.1),transparent_70%)]" />
            ) : (
                <>
                    {/* Layer 1: Large soft haze moving slowly */}
                    <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-fog-drift-1 opacity-[0.08]"
                        style={{
                            background: "radial-gradient(circle at 50% 50%, rgba(200, 210, 225, 0.4), transparent 60%)",
                            filter: "blur(40px)",
                        }}
                    />

                    {/* Layer 2: Secondary turbulence */}
                    <div className="absolute inset-[-50%] w-[200%] h-[200%] animate-fog-drift-2 opacity-[0.06]"
                        style={{
                            background: "radial-gradient(ellipse at 70% 30%, rgba(180, 190, 200, 0.3), transparent 50%)",
                            filter: "blur(24px)",
                        }}
                    />

                    {/* Layer 3: Faint bottom fog */}
                    <div className="absolute bottom-[-20%] left-[-20%] w-[140%] h-[50%] animate-fog-drift-3 opacity-[0.10]"
                        style={{
                            background: "radial-gradient(ellipse at 50% 100%, rgba(220, 230, 240, 0.3), transparent 70%)",
                            filter: "blur(30px)",
                        }}
                    />
                </>
            )}
        </div>
    );
}
