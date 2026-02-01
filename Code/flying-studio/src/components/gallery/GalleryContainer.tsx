"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  GENRES,
  Genre,
  BODY_PARTS,
  BodyPart,
  MOCK_PORTFOLIO,
} from "@/app/constants";
import { useMemo } from "react";

export default function GalleryContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Read State from URL (Single Source of Truth)
  const activeTab =
    searchParams.get("tab") === "portfolio" ? "portfolio" : "event";
  const genreParam = searchParams.get("genre");
  const bodyPartParam = searchParams.get("bodyPart");

  const selectedGenres = useMemo(() => {
    if (!genreParam) return [];
    return genreParam
      .split(",")
      .filter((g) => GENRES.includes(g as Genre)) as Genre[];
  }, [genreParam]);

  const selectedBodyParts = useMemo(() => {
    if (!bodyPartParam) return [];
    return bodyPartParam
      .split(",")
      .filter((b) => BODY_PARTS.includes(b as BodyPart)) as BodyPart[];
  }, [bodyPartParam]);

  // 2. Navigation / State Update Logic
  const updateParams = (
    newTab: string,
    newGenres: Genre[],
    newBodyParts: BodyPart[],
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update Tab
    if (newTab === "event") {
      params.delete("tab");
      params.delete("genre"); // Clear filters when leaving portfolio
      params.delete("bodyPart");
    } else {
      params.set("tab", "portfolio");
      if (newGenres.length > 0) {
        params.set("genre", newGenres.join(","));
      } else {
        params.delete("genre");
      }
      if (newBodyParts.length > 0) {
        params.set("bodyPart", newBodyParts.join(","));
      } else {
        params.delete("bodyPart");
      }
    }

    // Deterministic navigation
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleGenre = (genre: Genre) => {
    const current = new Set(selectedGenres);
    if (current.has(genre)) {
      current.delete(genre);
    } else {
      current.add(genre);
    }
    updateParams("portfolio", Array.from(current), selectedBodyParts);
  };

  const toggleBodyPart = (bodyPart: BodyPart) => {
    const current = new Set(selectedBodyParts);
    if (current.has(bodyPart)) {
      current.delete(bodyPart);
    } else {
      current.add(bodyPart);
    }
    updateParams("portfolio", selectedGenres, Array.from(current));
  };

  const switchTab = (tab: "event" | "portfolio") => {
    updateParams(
      tab,
      tab === "portfolio" ? selectedGenres : [],
      tab === "portfolio" ? selectedBodyParts : [],
    );
  };

  // 3. Filtering Logic (Inclusive OR)
  const filteredItems = useMemo(() => {
    return MOCK_PORTFOLIO.filter((item) => {
      // If no filters selected, show all
      if (selectedGenres.length === 0 && selectedBodyParts.length === 0) {
        return true;
      }

      const matchesGenre =
        selectedGenres.length === 0 ||
        item.genres.some((g) => selectedGenres.includes(g));
      const matchesBodyPart =
        selectedBodyParts.length === 0 ||
        item.bodyParts.some((b) => selectedBodyParts.includes(b));

      // Both genre and body part must match if filters are applied
      return matchesGenre && matchesBodyPart;
    });
  }, [selectedGenres, selectedBodyParts]);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex border-b border-stone-800 mb-8">
        <button
          onClick={() => switchTab("event")}
          className={`px-8 py-4 text-lg font-bold uppercase tracking-widest transition-colors ${activeTab === "event" ? "text-amber-500 border-b-2 border-amber-500" : "text-stone-500 hover:text-stone-300"}`}
        >
          Event
        </button>
        <button
          onClick={() => switchTab("portfolio")}
          className={`px-8 py-4 text-lg font-bold uppercase tracking-widest transition-colors ${activeTab === "portfolio" ? "text-amber-500 border-b-2 border-amber-500" : "text-stone-500 hover:text-stone-300"}`}
        >
          Portfolio
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[60vh]">
        {activeTab === "portfolio" ? (
          <div className="space-y-8">
            {/* Genre Filters */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">
                Genre
              </h3>
              <div className="flex flex-wrap gap-3">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${
                      selectedGenres.includes(g)
                        ? "bg-amber-500 text-stone-900 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                        : "bg-transparent text-stone-500 border-stone-800 hover:border-stone-600 hover:text-stone-300"
                    }`}
                  >
                    {g.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Part Filters */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">
                Body Part
              </h3>
              <div className="flex flex-wrap gap-3">
                {BODY_PARTS.map((b) => (
                  <button
                    key={b}
                    onClick={() => toggleBodyPart(b)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${
                      selectedBodyParts.includes(b)
                        ? "bg-amber-500 text-stone-900 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                        : "bg-transparent text-stone-500 border-stone-800 hover:border-stone-600 hover:text-stone-300"
                    }`}
                  >
                    {b.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="aspect-[3/4] bg-stone-900 relative group overflow-hidden rounded-sm border border-stone-900 hover:border-amber-500/50 transition-colors"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-stone-800 font-black text-4xl select-none">
                    FS
                  </div>
                  <img
                    src={item.image}
                    alt={`Tattoo by ${item.artist}`}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-bold truncate">
                      {item.artist}
                    </p>
                    <p className="text-amber-500 text-xs truncate max-w-full">
                      {item.genres.map((g) => g.replace(/_/g, " ")).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-xl text-stone-600 font-light">
                    No works found for selected filters.
                  </p>
                  <button
                    onClick={() => updateParams("portfolio", [], [])}
                    className="mt-4 text-amber-500 text-sm hover:underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 border border-dashed border-stone-800 rounded-lg">
            <h3 className="text-2xl font-bold text-stone-700 mb-2">
              Upcoming Events
            </h3>
            <p className="text-stone-500">
              Check back soon for guest spots and conventions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
