"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Background3D from "@/components/Background3D";
import EventHeroCard from "@/components/EventHeroCard";
import { HOME_EVENTS, GENRES, Genre } from "@/app/constants";
import ScrollReveal from "@/components/ScrollReveal";
import CustomCursor from "@/components/CustomCursor";

// --- Local Preview Components ---

// 1. Event Preview Grid (Limited items, square aspect)
function EventPreviewGrid({ items }: { items: typeof HOME_EVENTS }) {
  // Limit to 8 items max
  const previewItems = items.slice(0, 8);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {previewItems.map((item) => (
        <Link
          key={item.id}
          href={item.cta_link || "/gallery"}
          className="group block relative aspect-square overflow-hidden rounded-lg bg-stone-900/50 border border-white/5 hover:border-[#b59a5a]/50 transition-all duration-500 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
            <span className="text-[10px] sm:text-xs font-bold text-[#b59a5a] tracking-widest uppercase truncate w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              {item.title}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// 2. Genre Preview Card (3D Tilt Effect) - UPDATED SIZE
function GenrePreviewCard({ genre }: { genre: Genre }) {
  const href = `/gallery?tab=portfolio&genre=${genre}`;
  const displayName = genre
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Link
      href={href}
      className="group relative h-40 sm:h-48 perspective-1000 w-full"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-[#b59a5a]/50 transition-all duration-500 ease-out transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md">
        <div className="w-8 h-[2px] bg-white/20 mb-5 group-hover:w-16 group-hover:bg-[#b59a5a] transition-all duration-500"></div>
        <span className="text-sm sm:text-base font-medium uppercase tracking-[0.25em] text-white/70 group-hover:text-white transition-colors duration-300 text-center px-4 leading-relaxed">
          {displayName}
        </span>
      </div>
    </Link>
  );
}

// ... existing components ...

export default function HomePage() {
  const hero = HOME_EVENTS[0];
  const rest = HOME_EVENTS.slice(1);

  // Interaction State (Sections C-E only)
  const [isInteractiveZone, setIsInteractiveZone] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionC = document.getElementById("section-c");
      if (!sectionC) return;

      const rect = sectionC.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.8; // User sees enough of C

      // If Section C is entering viewport (top < triggerPoint)
      // AND we haven't scrolled past footer completely (optional)
      const isActive = rect.top < triggerPoint;

      setIsInteractiveZone(isActive);

      // Toggle body class for cursor hiding mechanism
      if (isActive) {
        document.body.classList.add("cursor-active");
      } else {
        document.body.classList.remove("cursor-active");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("cursor-active");
    };
  }, []);

  useEffect(() => {
    const sections = ["section-a", "section-b", "section-c"];
    let isScrolling = false;
    let currentSectionIndex = 0;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const scrollY = window.scrollY;
      const sectionC = document.getElementById("section-c");

      if (!sectionC) return;

      const sectionCTop = sectionC.getBoundingClientRect().top + scrollY;

      // If we are significantly below Section C (standard flow zone)
      if (scrollY > sectionCTop + 50) {
        return;
      }

      // We are in or near the Snap Zone (A, B, C)
      if (e.deltaY > 0) {
        // --- SCROLLING DOWN ---

        // If at C (last snap point), allow default scroll to flow into D
        if (currentSectionIndex >= sections.length - 1) {
          // Check if we are physically at C before releasing (sync issue prevention)
          const diff = Math.abs(scrollY - sectionCTop);
          if (diff < 50) return; // At C, let it scroll naturally
        }

        // If at A or B, snap to next
        if (currentSectionIndex < sections.length - 1) {
          e.preventDefault();
          const nextIndex = currentSectionIndex + 1;
          scrollToSection(nextIndex);
        }
      } else {
        // --- SCROLLING UP ---

        // If at A, prevent overscroll (optional, but good for snap feel)
        if (currentSectionIndex <= 0 && scrollY < 50) {
          return; // Let default handle bouncing or top
        }

        // If in flow below C, but scrolling up reaches C
        // (Handled by the initial check: if scrollY > sectionTop + 50 return)

        // If we are at C or B, snap up
        // Ensure we are not just scrolling within C content if C was taller (C is 100vh)

        e.preventDefault();
        const prevIndex = Math.max(0, currentSectionIndex - 1);
        scrollToSection(prevIndex);
      }
    };

    const scrollToSection = (index: number) => {
      if (index < 0 || index >= sections.length) return;

      isScrolling = true;
      currentSectionIndex = index;

      const targetId = sections[index];
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }

      setTimeout(() => {
        isScrolling = false;
      }, 800);
    };

    const syncSectionIndex = () => {
      const scrollY = window.scrollY;
      let minDiff = Infinity;
      let foundIndex = 0;

      sections.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const diff = Math.abs(scrollY - top);
          if (diff < minDiff) {
            minDiff = diff;
            foundIndex = idx;
          }
        }
      });
      currentSectionIndex = foundIndex;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", syncSectionIndex);

    syncSectionIndex();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", syncSectionIndex);
    };
  }, []);

  return (
    <>
      <CustomCursor isActive={isInteractiveZone} />
      <Background3D isActive={isInteractiveZone} />

      <main className="relative z-10 w-full h-full overflow-x-hidden">
        {/* Section A - Hero (Floating Text) */}
        <section
          id="section-a"
          className="relative min-h-screen md:min-h-[70vh] lg:min-h-[85vh] flex flex-col justify-center items-start rounded-none md:rounded-2xl lg:rounded-3xl overflow-hidden bg-no-repeat bg-fixed"
          style={{
            backgroundImage: "url(/placeholders/event-hero.jpg)",
            // sm-phone base: show 50% of image
            backgroundSize: "200vw auto",
            backgroundPosition: "top center",
          }}
        >
          {/* Responsive background sizing by explicit ranges:
              - sm-phone: 376px - 639px => show 50% of image (200vw)
              - lg-phone: 640px - 767px => show 75% of image (133.333vw)
              - tablet: 768px - 1023px => image fills width (100vw)
              - sm-desktop: 1024px - 1439px => 15% margin each side (70vw)
              - lg-desktop: 1440px+ => 20% margin each side (60vw)
          */}
          <style>{`
            /* sm-phone: 376px - 639px */
            @media (min-width: 376px) and (max-width: 639px) {
              section[style*="event-hero.jpg"] {
                min-height: 80vh !important;
                background-size: 200vw auto !important;
                background-position: top center !important;
              }
              section[style*="event-hero.jpg"] h1 {
                font-size: 2rem !important;
              }
              section[style*="event-hero.jpg"] p {
                font-size: 0.75rem !important;
              }
              section[style*="event-hero.jpg"] a {
                font-size: 0.625rem !important;
              }
            }

            /* lg-phone: 640px - 767px */
            @media (min-width: 640px) and (max-width: 767px) {
              section[style*="event-hero.jpg"] {
                min-height: 85vh !important;
                background-size: 133.333vw auto !important;
                background-position: top center !important;
              }
              section[style*="event-hero.jpg"] h1 {
                font-size: 3.75rem !important;
              }
              section[style*="event-hero.jpg"] p {
                font-size: 1.3125rem !important;
              }
              section[style*="event-hero.jpg"] a {
                font-size: 1.125rem !important;
              }
            }

            /* tablet: 768px - 1023px */
            @media (min-width: 768px) and (max-width: 1023px) {
              section[style*="event-hero.jpg"] {
                min-height: 90vh !important;
                background-size: 100vw auto !important;
                background-position: top center !important;
              }
              section[style*="event-hero.jpg"] h1 {
                font-size: 5.25rem !important;
              }
              section[style*="event-hero.jpg"] p {
                font-size: 1.5rem !important;
              }
              section[style*="event-hero.jpg"] a {
                font-size: 1.3125rem !important;
              }
            }

            /* sm-desktop: 1024px - 1439px */
            @media (min-width: 1024px) and (max-width: 1439px) {
              section[style*="event-hero.jpg"] {
                min-height: 95vh !important;
                background-size: 100vw auto !important;
                background-position: top center !important;
                background-repeat: no-repeat !important;
              }
              section[style*="event-hero.jpg"] h1 {
                font-size: 7.5rem !important;
              }
              section[style*="event-hero.jpg"] p {
                font-size: 1.6875rem !important;
              }
              section[style*="event-hero.jpg"] a {
                font-size: 1.425rem !important;
              }
            }

            /* lg-desktop: 1440px+ */
            @media (min-width: 1440px) {
              section[style*="event-hero.jpg"] {
                min-height: 100vh !important;
                background-size: 100vw auto !important;
                background-position: top center !important;
                background-repeat: no-repeat !important;
              }
              section[style*="event-hero.jpg"] h1 {
                font-size: 9rem !important;
              }
              section[style*="event-hero.jpg"] p {
                font-size: 1.875rem !important;
              }
              section[style*="event-hero.jpg"] a {
                font-size: 1.5rem !important;
              }
            }
          `}</style>
          {/* Dark overlay for text visibility */}
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 pl-4 md:pl-6 lg:pl-8 border-l-2 border-[#b59a5a]/40">
            <h1 className="text-5xl sm:text-6xl md:text-[6.75rem] lg:text-[12rem] font-thin tracking-tighter text-white/90 leading-[0.9] mix-blend-overlay">
              FLYING
              <br />
              <span className="font-bold tracking-tight text-white/100">
                STUDIO
              </span>
            </h1>
          </div>

          <p className="relative z-10 mt-6 md:mt-8 lg:mt-10 mx-4 md:mx-6 lg:mx-8 ml-4 md:ml-6 lg:ml-8 text-white/60 text-sm md:text-lg lg:text-xl font-light tracking-[0.05em] max-w-xs md:max-w-sm lg:max-w-md xl:max-w-xl 2xl:max-w-2xl leading-relaxed">
            이 세상을 바늘로 그리는 사람들 <br />
            <span className="text-[#b59a5a]/80 text-xs md:text-sm lg:text-sm tracking-[0.2em] mt-2 block">
              ARTIST COLLECTIVE · INCHEON
            </span>
          </p>

          <div className="relative z-10 mt-8 md:mt-10 lg:mt-12 mx-4 md:mx-6 lg:mx-8 ml-4 md:ml-6 lg:ml-8">
            <a
              href="/contact"
              className="group relative inline-flex items-center justify-center px-6 md:px-8 lg:px-10 py-3 md:py-4 overflow-hidden rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-[#b59a5a]/10 hover:border-[#b59a5a]/40 transition-all duration-500"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#b59a5a]/10 rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative text-xs md:text-sm lg:text-base tracking-[0.3em] text-white/80 group-hover:text-[#b59a5a] transition-colors">
                예약 문의
              </span>
            </a>
          </div>
        </section>

        {/* Section B - BG Video (Full Width) */}
        <section
          className="relative motion-section w-full bg-gradient-to-b from-stone-900 to-black overflow-hidden"
          id="section-b"
        >
          <style>{`
            /* sm-phone: 376px - 639px */
            @media (min-width: 376px) and (max-width: 639px) {
              section.motion-section {
                min-height: 80vh !important;
              }
            }

            /* lg-phone: 640px - 767px */
            @media (min-width: 640px) and (max-width: 767px) {
              section.motion-section {
                min-height: 85vh !important;
              }
            }

            /* tablet: 768px - 1023px */
            @media (min-width: 768px) and (max-width: 1023px) {
              section.motion-section {
                min-height: 90vh !important;
              }
            }

            /* sm-desktop: 1024px - 1439px */
            @media (min-width: 1024px) and (max-width: 1439px) {
              section.motion-section {
                min-height: 95vh !important;
              }
            }

            /* lg-desktop: 1440px+ */
            @media (min-width: 1440px) {
              section.motion-section {
                min-height: 100vh !important;
              }
            }
          `}</style>

          {/* BG Video Container */}
          <div className="absolute inset-0">
            <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(181,154,90,0.1),transparent_70%)]"></div>
          </div>
        </section>

        {/* Scene C - Event (Float Glass Panel) */}
        <section
          className="min-h-screen event-section flex items-center justify-center py-24 relative perspective-1000"
          id="section-c"
        >
          <style>{`
            /* Responsive section heights - all modes */
            @media (min-width: 376px) and (max-width: 639px) {
              section.event-section { min-height: 80vh !important; }
            }
            @media (min-width: 640px) and (max-width: 767px) {
              section.event-section { min-height: 85vh !important; }
            }
            @media (min-width: 768px) and (max-width: 1023px) {
              section.event-section { min-height: 90vh !important; }
            }
            @media (min-width: 1024px) and (max-width: 1439px) {
              section.event-section { min-height: 95vh !important; }
            }
            @media (min-width: 1440px) {
              section.event-section { min-height: 100vh !important; }
            }
          `}</style>
          <div className="w-full max-w-6xl px-4 sm:px-6">
            {/* Header floating outside */}
            <div className="mb-10 text-center">
              <ScrollReveal>
                <span className="inline-block py-1 px-3 rounded-full border border-[#b59a5a]/20 bg-[#b59a5a]/5 text-[10px] tracking-[0.3em] text-[#b59a5a] mb-4 backdrop-blur-sm">
                  MONTHLY DROPS
                </span>
                <h2 className="text-4xl text-white/90 font-thin tracking-wider">
                  이달의 이벤트
                </h2>
              </ScrollReveal>
            </div>

            {/* Main Glass Panel */}
            <div className="rounded-[3rem] border border-white/10 bg-[#0a0a0a]/60 backdrop-blur-2xl p-8 sm:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]">
              <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-start">
                {/* Hero Section */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#b59a5a]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-700"></div>
                  <div className="relative rounded-2xl overflow-hidden border border-white/10">
                    {hero && <EventHeroCard item={hero} />}
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="flex flex-col h-full justify-between gap-10">
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                      <h3 className="text-[#b59a5a] text-xs tracking-[0.25em] uppercase mb-3">
                        Notice
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed font-light break-keep">
                        이달의 이벤트 도안은 한정 기간 동안만 진행됩니다. <br />
                        예약 마감 시 조기 종료될 수 있습니다.
                      </p>
                    </div>

                    <div className="pl-2 border-l border-white/10">
                      <p className="text-xs text-white/40 leading-relaxed max-w-md break-keep">
                        * 갤러리 이미지는 참고용이며 동일한 결과를 보장하지
                        않습니다. 피부 상태·부위·에이징에 따라 표현이 달라질 수
                        있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-6 pb-2 border-b border-white/5">
                      <span className="text-xs text-white/50 tracking-widest uppercase">
                        Other Concepts
                      </span>
                      <Link
                        href="/gallery"
                        className="text-[10px] text-[#b59a5a] tracking-widest hover:text-white transition-colors"
                      >
                        전체 보기
                      </Link>
                    </div>
                    <EventPreviewGrid items={rest} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scene D - Genre (Floating Tiles) */}
        <section
          className="min-h-screen genre-section flex items-center justify-center py-24 relative"
          id="section-d"
        >
          <style>{`
            /* Responsive section heights - all modes */
            @media (min-width: 376px) and (max-width: 639px) {
              section.genre-section { min-height: 80vh !important; }
            }
            @media (min-width: 640px) and (max-width: 767px) {
              section.genre-section { min-height: 85vh !important; }
            }
            @media (min-width: 768px) and (max-width: 1023px) {
              section.genre-section { min-height: 90vh !important; }
            }
            @media (min-width: 1024px) and (max-width: 1439px) {
              section.genre-section { min-height: 95vh !important; }
            }
            @media (min-width: 1440px) {
              section.genre-section { min-height: 100vh !important; }
            }
          `}</style>
          <div className="w-full max-w-5xl px-4 sm:px-6">
            <div className="flex flex-col items-center mb-16">
              <ScrollReveal>
                <h2 className="text-4xl sm:text-6xl text-white/90 font-thin tracking-[0.15em] mix-blend-screen">
                  STYLES
                </h2>
                <div className="mt-6 w-px h-24 bg-gradient-to-b from-[#b59a5a]/50 to-transparent"></div>
              </ScrollReveal>
            </div>

            {/* Floating Tiles Container */}
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[#b59a5a]/5 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="relative rounded-[2rem] bg-white/[0.01] border border-white/5 backdrop-blur-sm p-8 sm:p-12">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {GENRES.map((g, i) => (
                    <div key={g} style={{ transitionDelay: `${i * 50}ms` }}>
                      <GenrePreviewCard genre={g} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-white/30 text-xs tracking-[0.3em] font-light">
                  장르를 선택하면 포트폴리오로 이동합니다
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scene E - Location (Grounded) */}
        <section
          className="min-h-[80vh] location-section flex items-center justify-center py-24 relative"
          id="section-e"
        >
          <style>{`
            /* Responsive section heights - all modes */
            @media (min-width: 376px) and (max-width: 639px) {
              section.location-section { min-height: 80vh !important; }
            }
            @media (min-width: 640px) and (max-width: 767px) {
              section.location-section { min-height: 85vh !important; }
            }
            @media (min-width: 768px) and (max-width: 1023px) {
              section.location-section { min-height: 90vh !important; }
            }
            @media (min-width: 1024px) and (max-width: 1439px) {
              section.location-section { min-height: 95vh !important; }
            }
            @media (min-width: 1440px) {
              section.location-section { min-height: 100vh !important; }
            }
          `}</style>
          <div className="w-full max-w-5xl px-4 sm:px-6">
            <div className="flex flex-col items-start mb-12 pl-4">
              <ScrollReveal>
                <span className="text-[#b59a5a] text-xs tracking-[0.5em] uppercase mb-4 opacity-80">
                  Visit Us
                </span>
                <h2 className="text-4xl font-light tracking-wide text-white">
                  LOCATION
                </h2>
              </ScrollReveal>
            </div>

            {/* Panel */}
            <div className="rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-3 shadow-2xl">
              <div className="rounded-[2rem] overflow-hidden bg-stone-950/50 border border-white/5">
                <div className="grid md:grid-cols-[1fr,1.5fr]">
                  {/* Info */}
                  <div className="p-10 sm:p-14 flex flex-col justify-between bg-gradient-to-br from-white/[0.03] to-transparent">
                    <div>
                      <h3 className="text-2xl text-white/90 font-thin tracking-wider mb-8">
                        Flying Studio
                      </h3>

                      <div className="space-y-8">
                        <div className="group">
                          <div className="text-xs text-[#b59a5a] tracking-widest uppercase mb-2 group-hover:text-white transition-colors">
                            Address
                          </div>
                          <p className="text-white/70 text-sm font-light leading-relaxed break-keep">
                            인천광역시 남동구 <br />
                            <span className="text-white/30 text-xs mt-2 block">
                              상세 주소는 예약 확정 후 안내드립니다.
                            </span>
                          </p>
                        </div>

                        <div className="group">
                          <div className="text-xs text-[#b59a5a] tracking-widest uppercase mb-2 group-hover:text-white transition-colors">
                            Guideline
                          </div>
                          <p className="text-white/70 text-sm font-light leading-relaxed break-keep">
                            대면 상담 및 시술 방문 시 <br />
                            <span className="underline underline-offset-4 text-white/90">
                              신분증
                            </span>
                            을 반드시 지참해 주시기 바랍니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                      <p className="text-white/30 text-xs tracking-wider">
                        operating hours: 10:00 - 20:00
                      </p>
                    </div>
                  </div>

                  {/* Map Area */}
                  <div className="relative min-h-[300px] bg-[#111]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border border-[#b59a5a]/30 rounded-full flex items-center justify-center mx-auto mb-4 text-[#b59a5a]">
                          <span className="block w-2 h-2 bg-[#b59a5a] rounded-full"></span>
                        </div>
                        <span className="text-white/30 text-xs tracking-[0.3em] uppercase">
                          Map View
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-stone-950/80 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-white/5 bg-black">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center">
            <h4 className="text-white/20 text-xl tracking-[0.8em] font-extralight mb-10 mix-blend-difference">
              FLYING STUDIO
            </h4>
            <div className="flex gap-8 mb-10">
              <a
                href="#"
                className="text-white/30 hover:text-[#b59a5a] transition-colors text-xs tracking-widest uppercase"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-white/30 hover:text-[#b59a5a] transition-colors text-xs tracking-widest uppercase"
              >
                Contact
              </a>
            </div>
            <p className="text-white/10 text-[10px] uppercase tracking-widest leading-loose">
              플라잉 스튜디오 · 대표: 김땡땡 · 사업자등록번호: 123-45-67890{" "}
              <br className="sm:hidden" />
              개인정보관리책임자: 박땡땡 · 인천광역시 남동구 <br />
              Copyright © 2026 Flying Studio. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
