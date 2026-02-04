"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
  maxTiltDeg?: number; // default 3
  isActive?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Background3D({ maxTiltDeg = 3, isActive = false }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const currentRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = (x: number, y: number) => {
      // 배경만 살짝 움직이게 (과함 방지)
      el.style.transform = `rotateX(${x}deg) rotateY(${y}deg) translateZ(-80px) scale(1.18)`;
    };

    if (prefersReducedMotion || !isActive) {
      apply(0, 0);
      return;
    }

    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const px = e.clientX / window.innerWidth; // 0..1
      const py = e.clientY / window.innerHeight; // 0..1
      const cx = px - 0.5;
      const cy = py - 0.5;

      const tx = clamp(-cy * (maxTiltDeg * 2), -maxTiltDeg, maxTiltDeg);
      const ty = clamp(cx * (maxTiltDeg * 2), -maxTiltDeg, maxTiltDeg);

      targetRef.current = { x: tx, y: ty };
    };

    const onLeave = () => {
      targetRef.current = { x: 0, y: 0 };
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);

      const t = 0.06; // 더 묵직하게
      const cx =
        currentRef.current.x + (targetRef.current.x - currentRef.current.x) * t;
      const cy =
        currentRef.current.y + (targetRef.current.y - currentRef.current.y) * t;

      const sx = Math.abs(cx) < 0.001 ? 0 : cx;
      const sy = Math.abs(cy) < 0.001 ? 0 : cy;

      currentRef.current = { x: sx, y: sy };
      apply(sx, sy);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    apply(0, 0);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [maxTiltDeg, prefersReducedMotion, isActive]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-forest-black">
      {/* 3D background plane */}
      <div
        ref={ref}
        className="absolute inset-[-20%] will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transition: prefersReducedMotion
            ? "none"
            : "transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <div className="absolute inset-0 opacity-80 [background:radial-gradient(1200px_circle_at_20%_15%,rgba(30,90,55,0.45),transparent_55%),radial-gradient(900px_circle_at_80%_25%,rgba(181,154,90,0.22),transparent_55%),radial-gradient(1100px_circle_at_55%_85%,rgba(45,28,18,0.45),transparent_60%)]" />
        <div className="absolute inset-0 opacity-55 [background:linear-gradient(180deg,rgba(0,0,0,0.10)_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.70)_100%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:10px_10px]" />
      </div>

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(900px_circle_at_50%_35%,rgba(0,0,0,0.0),rgba(0,0,0,0.65))]" />
    </div>
  );
}
