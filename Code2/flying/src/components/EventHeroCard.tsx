"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { EventItem } from "@/app/constants";

export default function EventHeroCard({ item }: { item: EventItem }) {
  const isExpired = item.event_status === "expired";

  return (
    <motion.div
      whileHover={!isExpired ? { y: -12, scale: 1.08 } : undefined}
      whileTap={!isExpired ? { scale: 0.99 } : undefined}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_28px_70px_rgba(0,0,0,0.62)]"
    >
      <div className="relative aspect-[16/9] bg-black/40">
        {/* Focus glow (subtle gold) */}
        {!isExpired && (
          <div className="pointer-events-none absolute inset-0 [background:radial-gradient(900px_circle_at_20%_15%,rgba(181,154,90,0.22),transparent_55%)]" />
        )}

        {/* Expired overlay */}
        {isExpired && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs tracking-[0.22em] text-white/70">
              EXPIRED
            </span>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg tracking-wide text-white-main">{item.title}</h3>
          <span className="text-[11px] tracking-[0.22em] text-gold-antique">
            EVENT
          </span>
        </div>

        {item.description && (
          <p className="mt-3 text-sm leading-relaxed text-white-muted">
            {item.description}
          </p>
        )}

        {/* CTA */}
        {item.cta_link && item.cta_label && !isExpired && (
          <div className="mt-5">
            <Link
              href={item.cta_link}
              className="inline-flex items-center justify-center rounded-2xl border border-gold-soft px-5 py-3 text-sm tracking-[0.18em] text-gold-antique hover:bg-gold-glow-weak transition"
            >
              {item.cta_label}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
