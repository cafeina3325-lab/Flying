"use client";

import Link from "next/link";

type EventItem = {
  id: string;
  title: string;
  thumbnail_image: string;
  full_image?: string;
  created_at?: string;
  event_status?: "active" | "expired";
  cta_label?: string;
  cta_link?: string;
};

type Props = {
  items: EventItem[];
};

/**
 * Mobile-first responsive grid:
 * - Mobile: 2 columns
 * - Tablet: 3 columns
 * - Desktop: 5 columns
 *
 * Also:
 * - Keeps images contained (no overflow)
 * - Keeps UI from filling entire viewport density on mobile
 */
export default function EventGrid({ items }: Props) {
  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
      {items.map((it) => {
        const isExpired = it.event_status === "expired";

        return (
          <Link
            key={it.id}
            href={it.cta_link ?? "/gallery"}
            className={[
              "group relative overflow-hidden rounded-2xl border border-soft",
              "bg-black/20 backdrop-blur-sm",
              "shadow-[0_14px_40px_rgba(0,0,0,0.45)]",
              "transition will-change-transform",
              "hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(0,0,0,0.65)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-soft focus-visible:ring-offset-0",
            ].join(" ")}
            aria-label={it.title}
          >
            {/* Image */}
            <div className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.thumbnail_image}
                alt={it.title}
                className={[
                  "h-full w-full object-cover",
                  "transition duration-300",
                  "group-hover:scale-[1.03]",
                  isExpired ? "opacity-70" : "opacity-95",
                ].join(" ")}
                loading="lazy"
              />
              {/* soft overlay */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 [background:linear-gradient(180deg,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.55)_100%)]" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 px-3 py-3">
              <div className="min-w-0">
                <div className="truncate text-xs text-white-main">{it.title}</div>
                {it.created_at ? (
                  <div className="mt-1 text-[10px] tracking-[0.18em] text-white-dim">
                    {it.created_at}
                  </div>
                ) : null}
              </div>

              <div className="shrink-0 text-[10px] tracking-[0.22em] text-gold-antique">
                {isExpired ? "EXPIRED" : "EVENT"}
              </div>
            </div>

            {/* Expired badge */}
            {isExpired ? (
              <div className="pointer-events-none absolute left-2 top-2 rounded-full border border-white/15 bg-black/45 px-2 py-1 text-[10px] tracking-[0.18em] text-white/70">
                (EXPIRED)
              </div>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
