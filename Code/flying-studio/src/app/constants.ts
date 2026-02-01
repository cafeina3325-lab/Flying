export const GENRES = [
  "irezumi",
  "blackwork",
  "black_and_grey",
  "old_school",
  "lettering",
  "tribal",
  "east_asian_ink",
  "watercolor",
  "illustration",
  "mandala",
  "sak_yant",
  "other",
] as const;

export const BODY_PARTS = [
  "arm",
  "leg",
  "back",
  "chest",
  "shoulder",
  "neck",
  "hand",
  "foot",
  "side",
  "stomach",
] as const;

export type Genre = (typeof GENRES)[number];
export type BodyPart = (typeof BODY_PARTS)[number];

export interface PortfolioItem {
  id: string;
  image: string;
  artist: string;
  genres: Genre[];
  bodyParts: BodyPart[];
}

// Generate some deterministic mock data
export const MOCK_PORTFOLIO: PortfolioItem[] = Array.from({ length: 50 }).map(
  (_, i) => {
    // Assign 1-2 random genres
    const shuffledGenres = [...GENRES].sort(() => 0.5 - Math.random());
    const itemGenres = shuffledGenres.slice(0, (i % 2) + 1);

    // Assign 1-2 random body parts
    const shuffledBodyParts = [...BODY_PARTS].sort(() => 0.5 - Math.random());
    const itemBodyParts = shuffledBodyParts.slice(0, (i % 2) + 1);

    return {
      id: `item-${i + 1}`,
      image: `https://placehold.co/400x500/1a1a1a/FFF?text=Tattoo+${i + 1}`,
      artist: `Artist ${(i % 5) + 1}`,
      genres: itemGenres,
      bodyParts: itemBodyParts,
    };
  },
);
export type EventStatus = "active" | "expired";

export type EventItem = {
  id: string;
  title: string;
  thumbnail_image: string; // card image
  full_image?: string; // overlay 대비용(지금은 optional)
  description?: string;
  created_at: string; // ISO string
  event_status: EventStatus;
  cta_label?: string;
  cta_link?: string;
  // 월별 교체 운영을 위한 태그(선택): "2026-01"
  month_tag?: string;
};

/**
 * HOME SECTION C (Event Design Preview)
 * - monthly replaceable content
 * - keep at least 1 hero + a few cards
 */
export const HOME_EVENTS: EventItem[] = [
  {
    id: "event-hero-2026-01",
    title: "January Event — Signature Flash",
    thumbnail_image: "/placeholders/event-hero.jpg",
    full_image: "/placeholders/event-hero-full.jpg",
    description:
      "이번 달 한정 이벤트 도안. 상담 예약 후 진행 가능하며, 피부 상태·부위에 따라 조정될 수 있습니다.",
    created_at: "2026-01-01T00:00:00.000Z",
    event_status: "active",
    cta_label: "SEND REQUEST",
    cta_link: "/contact",
    month_tag: "2026-01",
  },
  {
    id: "event-2026-01-01",
    title: "Flash Set A",
    thumbnail_image: "/placeholders/event-01.jpg",
    created_at: "2026-01-01T00:00:00.000Z",
    event_status: "active",
    cta_label: "CONTACT",
    cta_link: "/contact",
    month_tag: "2026-01",
  },
  {
    id: "event-2026-01-02",
    title: "Flash Set B",
    thumbnail_image: "/placeholders/event-02.jpg",
    created_at: "2026-01-01T00:00:00.000Z",
    event_status: "active",
    cta_label: "VIEW GALLERY",
    cta_link: "/gallery",
    month_tag: "2026-01",
  },
  {
    id: "event-2025-12-archived",
    title: "December Event (Archived)",
    thumbnail_image: "/placeholders/event-archived.jpg",
    created_at: "2025-12-01T00:00:00.000Z",
    event_status: "expired",
    month_tag: "2025-12",
  },
];
