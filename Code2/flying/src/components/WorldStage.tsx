"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
  children: React.ReactNode;
  maxTiltDeg?: number; // default 4
  perspectivePx?: number; // default 900
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function WorldStage({
  children,
  maxTiltDeg = 4,
  perspectivePx = 900,
  className = "",
}: Props) {
  const stageRef = useRef<HTMLElement | null>(null);
  const bg3DRef = useRef<HTMLDivElement | null>(null);

  const currentRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const bg = bg3DRef.current;
    if (!stage || !bg) return;

    const apply = (x: number, y: number) => {
      // BG만 3D로 움직이게: UI는 고정
      bg.style.transform = `rotateX(${x}deg) rotateY(${y}deg) translateZ(-60px) scale(1.12)`;
    };

    if (prefersReducedMotion) {
      currentRef.current = { x: 0, y: 0 };
      targetRef.current = { x: 0, y: 0 };
      apply(0, 0);
      return;
    }

    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

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

      // 묵직하게 따라오는 느낌 (과함 방지)
      const t = 0.08;

      const cx =
        currentRef.current.x + (targetRef.current.x - currentRef.current.x) * t;
      const cy =
        currentRef.current.y + (targetRef.current.y - currentRef.current.y) * t;

      const sx = Math.abs(cx) < 0.001 ? 0 : cx;
      const sy = Math.abs(cy) < 0.001 ? 0 : cy;

      currentRef.current = { x: sx, y: sy };
      apply(sx, sy);
    };

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave, { passive: true });

    apply(0, 0);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [maxTiltDeg, prefersReducedMotion]);

  return (
    <section
      ref={stageRef}
      className={[
        "relative mt-12 overflow-hidden rounded-[32px] border border-soft",
        "bg-forest-black",
        "shadow-deep",
        className,
      ].join(" ")}
      style={{ perspective: `${perspectivePx}px` }}
      aria-label="World Stage"
    >
      {/* BG ONLY (3D) */}
      <div
        ref={bg3DRef}
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transition: prefersReducedMotion
            ? "none"
            : "transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        <div className="absolute inset-0 opacity-75 [background:radial-gradient(1200px_circle_at_20%_15%,rgba(30,90,55,0.42),transparent_55%),radial-gradient(900px_circle_at_80%_25%,rgba(181,154,90,0.22),transparent_55%),radial-gradient(1100px_circle_at_55%_85%,rgba(45,28,18,0.42),transparent_60%)]" />
        <div className="absolute inset-0 opacity-45 [background:linear-gradient(180deg,rgba(0,0,0,0.00)_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.60)_100%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:10px_10px]" />
      </div>

      {/* CONTENT (UI) — BG가 보이도록 상하 여백을 넉넉히 */}
      <div className="relative px-6 sm:px-10 py-10 sm:py-16">{children}</div>
    </section>
  );
}
