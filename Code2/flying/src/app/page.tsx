"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Background3D from "@/components/Background3D";

import { GENRES, Genre, MOCK_PORTFOLIO } from "@/app/constants";
import ScrollReveal from "@/components/ScrollReveal";
import CustomCursor from "@/components/CustomCursor";
import NavBar from "@/components/NavBar"; // New Navbar
import MilkyWayEffect from "@/components/MilkyWayEffect";
import TwinklingStars from "@/components/TwinklingStars";
import DraggableScrollContainer from "@/components/DraggableScrollContainer";

// --- Local Preview Components ---



// 2. Genre Preview Card (3D Tilt Effect) - UPDATED SIZE
function GenrePreviewCard({ genre }: { genre: Genre }) {
  const href = `/genre?tab=portfolio&genre=${genre}`;
  const displayName = genre
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <Link
      href={href}
      className="group relative h-[25rem] sm:h-[30rem] perspective-1000 w-full block"
    >
      <div className="glass-card-hover absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] group-hover:-translate-y-2">
        <div className="w-8 h-[2px] bg-white/20 mb-5 group-hover:w-16 group-hover:bg-gold-antique transition-all duration-500"></div>
        <span className="text-sm sm:text-base font-medium uppercase tracking-[0.25em] text-white-muted group-hover:text-white-main transition-colors duration-300 text-center px-4 leading-relaxed">
          {displayName}
        </span>
      </div>
    </Link>
  );
}

// ... existing components ...

export default function HomePage() {


  // Interaction State (Sections C-E only)
  const [isInteractiveZone, setIsInteractiveZone] = useState(false);
  // Milky Way State (All except B)
  const [showMilkyWay, setShowMilkyWay] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const sectionC = document.getElementById("section-c");
      if (!sectionC) return;

      const rect = sectionC.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 1.2; // Trigger earlier (well before it fills screen)

      // If Section C is near viewport (top < 1.2 * height)
      // Basically, if we are scrolling towards C, activate it.
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

    // Observer for Section B to hide Milky Way
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowMilkyWay(false);
          } else {
            setShowMilkyWay(true);
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of B is visible
    );

    const sectionB = document.getElementById("section-b");
    if (sectionB) observer.observe(sectionB);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("cursor-active");
      if (sectionB) observer.unobserve(sectionB);
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

  // --- Sticky Hero Logic ---
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end start"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0.8, 0.95], [1, 0]);
  const subOpacity1 = useTransform(scrollYProgress, [0.85, 0.98], [1, 0]);
  const subOpacity2 = useTransform(scrollYProgress, [0.88, 1], [1, 0]);

  const titleY = useTransform(scrollYProgress, [0.8, 1], ["0%", "-20%"]);
  const subY = useTransform(scrollYProgress, [0.8, 1], ["0%", "-30%"]);

  return (
    <>
      <CustomCursor isActive={isInteractiveZone} />
      <MilkyWayEffect isVisible={showMilkyWay} />
      <Background3D isActive={isInteractiveZone} />
      {/* Stars must be after Background3D to be on top if z-indexes conflict, though z-1 should handle it */}
      <TwinklingStars isActive={isInteractiveZone} />

      <main className="relative z-10 w-full h-full overflow-x-hidden">
        <NavBar />
        <div ref={heroWrapperRef} className="relative z-0">
          {/* Sticky Text Layer */}
          <div className="sticky top-0 h-screen flex flex-col justify-center items-start z-30 pointer-events-none overflow-hidden">
            <div className="w-full px-4 md:px-6 lg:px-8 pl-4 md:pl-6 lg:pl-8 border-l-4 border-[#D6BE8A] ml-4 md:ml-6 lg:ml-8">
              <motion.h1
                style={{ opacity: titleOpacity, y: titleY }}
                className="text-5xl sm:text-6xl md:text-[6.75rem] lg:text-[12rem] font-thin tracking-tighter text-white-main leading-[0.9]"
              >
                <span className="font-bold tracking-tight text-[#D6BE8A] drop-shadow-[0_0_20px_rgba(214,190,138,0.7)]">FLYING</span>
                <br />
                <span className="font-medium tracking-tighter text-white-main mix-blend-overlay">
                  STUDIO
                </span>
              </motion.h1>
            </div>

            <motion.p
              style={{ opacity: subOpacity1, y: subY }}
              className="mt-6 md:mt-8 lg:mt-10 mx-4 md:mx-6 lg:mx-8 ml-4 md:ml-6 lg:ml-8 text-white-muted text-sm md:text-lg lg:text-xl font-light tracking-[0.05em] max-w-xs md:max-w-sm lg:max-w-md xl:max-w-xl 2xl:max-w-2xl leading-relaxed"
            >
              이 세상을 바늘로 그리는 사람들
            </motion.p>

            <motion.span
              style={{ opacity: subOpacity2, y: subY }}
              className="ml-4 md:ml-6 lg:ml-8 mt-2 text-gold-antique text-xs md:text-sm lg:text-sm tracking-[0.2em] block mx-4 md:mx-6 lg:mx-8"
            >
              ARTIST COLLECTIVE · INCHEON
            </motion.span>
          </div>

          {/* Section A - Hero (Background Only) */}
          <section
            id="section-a"
            className="relative -mt-[100vh] min-h-screen md:min-h-[70vh] lg:min-h-[85vh] flex flex-col justify-center items-start rounded-none md:rounded-2xl lg:rounded-3xl overflow-hidden bg-no-repeat bg-fixed z-10"
            style={{
              backgroundImage: "url(/placeholders/event-hero.jpg)",
              // sm-phone base: show 50% of image
              backgroundSize: "200vw auto",
              backgroundPosition: "top center",
            }}
          >
            {/* Styles kept same as before */}
            <style>{`
              /* sm-phone: 376px - 639px */
              @media (min-width: 376px) and (max-width: 639px) {
                section[style*="event-hero.jpg"] {
                  min-height: 80vh !important;
                  background-size: 200vw auto !important;
                  background-position: top center !important;
                }
              }
  
              /* lg-phone: 640px - 767px */
              @media (min-width: 640px) and (max-width: 767px) {
                section[style*="event-hero.jpg"] {
                  min-height: 85vh !important;
                  background-size: 133.333vw auto !important;
                  background-position: top center !important;
                }
              }
  
              /* tablet: 768px - 1023px */
              @media (min-width: 768px) and (max-width: 1023px) {
                section[style*="event-hero.jpg"] {
                  min-height: 90vh !important;
                  background-size: 100vw auto !important;
                  background-position: top center !important;
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
              }
  
              /* lg-desktop: 1440px+ */
              @media (min-width: 1440px) {
                section[style*="event-hero.jpg"] {
                  min-height: 100vh !important;
                  background-size: 100vw auto !important;
                  background-position: top center !important;
                  background-repeat: no-repeat !important;
                }
              }
            `}</style>
            {/* Dark overlay for text visibility */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Text removed from here, moved to sticky container */}
          </section>

          {/* Section B - BG Video (Full Width) */}
          <section
            className="relative motion-section w-full bg-gradient-dark-depth overflow-hidden z-10"
            id="section-b"
          >
            <style>{`
              /* sm-phone: 376px - 639px */
              @media (min-width: 376px) and (max-width: 639px) {
                section.motion-section {
                  min-height: 80vh !important;
                  background-size: 200vw auto !important;
                }
              }
  
              /* lg-phone: 640px - 767px */
              @media (min-width: 640px) and (max-width: 767px) {
                section.motion-section {
                  min-height: 85vh !important;
                  background-size: 133.333vw auto !important;
                }
              }
  
              /* tablet: 768px - 1023px */
              @media (min-width: 768px) and (max-width: 1023px) {
                section.motion-section {
                  min-height: 90vh !important;
                  background-size: 100vw auto !important;
                }
              }
  
              /* sm-desktop: 1024px - 1439px */
              @media (min-width: 1024px) and (max-width: 1439px) {
                section.motion-section {
                  min-height: 95vh !important;
                  background-size: 100vw auto !important;
                }
              }
  
              /* lg-desktop: 1440px+ */
              @media (min-width: 1440px) {
                section.motion-section {
                  min-height: 100vh !important;
                  background-size: 100vw auto !important;
                }
              }
            `}</style>

            {/* BG Video Container */}
            <div className="absolute inset-0">
              <video
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/placeholders/arirang.mp4" type="video/mp4" />
              </video>
              {/* Dark Overlay (70% Black) */}
              <div className="absolute inset-0 bg-black/70"></div>
              <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(181,154,90,0.1),transparent_70%)] mix-blend-overlay"></div>
            </div>
          </section>
        </div>

        {/* Scene C - Event (Float Glass Panel) */}
        <section
          className="min-h-screen event-section flex items-center justify-center py-32 relative perspective-1000"
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
            {/* Header floating outside - Left Aligned & Standardized */}
            <div className="mb-12">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-widest text-[#D6BE8A] drop-shadow-[0_0_25px_rgba(214,190,138,0.3)] border-b-2 border-[#D6BE8A]/60 py-8 px-12 inline-block uppercase text-center">
                  이달의 이벤트
                </h2>
                <span className="block text-gold-active text-base tracking-[0.5em] uppercase mt-4 font-light opacity-80">
                  MONTHLY DROPS
                </span>
              </ScrollReveal>
            </div>

            {/* Main Glass Panel */}
            <div className="glass-panel-heavy p-6 sm:p-10">

              {/* Horizontal Scroll Grid (2 rows) */}
              <div className="w-full mb-8">
                <DraggableScrollContainer className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
                  <div className="grid grid-rows-1 grid-flow-col gap-4 w-max">
                    {MOCK_PORTFOLIO.slice(0, 16).map((item) => (
                      <div key={item.id} className="glass-card-hover w-[180px] sm:w-[220px] aspect-[4/5] relative rounded-lg group snap-start">
                        <Image
                          src={item.image}
                          alt={item.artist}
                          fill
                          className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          sizes="(max-width: 640px) 180px, 220px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <span className="text-xs text-white/80 font-medium">{item.artist}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DraggableScrollContainer>
              </div>

              {/* Notice Box */}
              <div className="p-6 rounded-xl bg-black/50 border border-gold-soft/30">
                <h3 className="text-gold-active font-bold mb-4 tracking-widest text-sm uppercase">Notice</h3>
                <ul className="text-sm text-[#D6BE8A]/90 space-y-3 leading-relaxed font-light">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D6BE8A] mt-1.5 w-1 h-1 rounded-full bg-current block shrink-0"></span>
                    <span>이달의 이벤트 도안은 한정 기간 동안만 진행됩니다.<br /><span className="text-stone-400">예약 마감 시 조기 종료될 수 있습니다.</span></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D6BE8A] mt-1.5 w-1 h-1 rounded-full bg-current block shrink-0"></span>
                    <span>갤러리 이미지는 참고용이며 동일한 결과를 보장하지 않습니다. 피부 상태·부위·에이징에 따라 표현이 달라질 수 있습니다.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Scene D - Genre (Floating Tiles) */}
        <section
          className="min-h-screen genre-section flex items-center justify-center py-32 relative"
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
          <div className="w-full max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-start mb-12">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-widest text-[#D6BE8A] drop-shadow-[0_0_25px_rgba(214,190,138,0.3)] border-b-2 border-[#D6BE8A]/60 py-8 px-12 inline-block uppercase text-center">
                  STYLES
                </h2>
              </ScrollReveal>
            </div>

            {/* Floating Tiles Container */}
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[#3A2A1F]/20 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="glass-panel-heavy p-8 sm:p-12">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {GENRES.map((g, i) => (
                    <div key={g} style={{ transitionDelay: `${i * 50}ms` }}>
                      <GenrePreviewCard genre={g} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-white-dim text-xs tracking-[0.3em] font-light">
                  장르를 선택하면 해당 챕터로 이동합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scene E - Consultation Flow (Grounded) */}
        <section
          className="min-h-[80vh] flow-section flex items-center justify-center py-32 relative"
          id="section-e"
        >
          <style>{`
            /* Responsive section heights - all modes */
            @media (min-width: 376px) and (max-width: 639px) {
              section.flow-section { min-height: 80vh !important; }
            }
            @media (min-width: 640px) and (max-width: 767px) {
              section.flow-section { min-height: 85vh !important; }
            }
            @media (min-width: 768px) and (max-width: 1023px) {
              section.flow-section { min-height: 90vh !important; }
            }
            @media (min-width: 1024px) and (max-width: 1439px) {
              section.flow-section { min-height: 95vh !important; }
            }
            @media (min-width: 1440px) {
              section.flow-section { min-height: 100vh !important; }
            }
          `}</style>
          <div className="w-full max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-start mb-16">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-widest text-[#D6BE8A] drop-shadow-[0_0_25px_rgba(214,190,138,0.3)] border-b-2 border-[#D6BE8A]/60 py-8 px-12 inline-block uppercase text-center">
                  Consultation Flow
                </h2>
                <span className="block text-gold-soft/80 text-sm sm:text-base tracking-[0.05em] mt-6 font-light break-keep">
                  모든 시술은 대면 상담을 통해 결정됩니다.
                </span>
              </ScrollReveal>
            </div>

            {/* Main Glass Panel for Steps */}
            <div className="glass-panel-heavy p-8 sm:p-12 mb-20">
              {/* Steps Grid */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[
                  {
                    label: "01",
                    title: "Online Request",
                    body: "원하시는 시술 부위와 스타일을 선택하고 대면 상담 요청을 접수합니다."
                  },
                  {
                    label: "02",
                    title: "In-Person Consultation",
                    body: "대면 상담을 통해 디자인 방향, 시술 가능 여부, 세부 조건을 확인합니다."
                  },
                  {
                    label: "03",
                    title: "Decision",
                    body: "상담 결과에 따라 시술 진행 여부가 결정되며, 상황에 따라 시술이 제한되거나 거절될 수 있습니다."
                  },
                  {
                    label: "04",
                    title: "Tattoo Session",
                    body: "시술이 확정된 경우에 한해 일정 협의 후 시술이 진행됩니다."
                  }
                ].map((step) => (
                  <motion.div
                    key={step.label}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                    }}
                    className="glass-card-hover group relative p-8 rounded-[2rem]"
                  >
                    <span className="text-6xl font-bold text-gold-antique/20 absolute top-4 right-6 select-none group-hover:text-gold-antique/40 transition-colors">
                      {step.label}
                    </span>
                    <div className="relative z-10 pt-8">
                      <h3 className="text-xl text-gold-soft font-medium tracking-wide mb-4 group-hover:text-gold-active transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-white-muted leading-loose break-keep font-light group-hover:text-white-main transition-colors">
                        {step.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Bottom Interaction */}
            <div className="text-center">
              <p className="text-sm text-stone-400 mb-10 tracking-wide font-light">
                온라인 접수는 시술 예약이 아니며, 상담 결과에 따라 시술이 진행되지 않을 수 있습니다.
              </p>

              <Link href="/contact">
                <button className="group relative px-10 py-4 sm:px-14 sm:py-5 rounded-full overflow-hidden bg-gold-soft/5 border border-gold-soft hover:border-gold-active hover:shadow-[0_0_20px_rgba(214,190,138,0.3)] text-gold-active transition-all duration-500">
                  <span className="absolute inset-0 w-full h-full bg-gold-soft/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out"></span>
                  <span className="relative z-10 text-sm sm:text-base tracking-[0.2em] font-semibold uppercase">
                    Request Consultation
                  </span>
                </button>
              </Link>

              <p className="mt-6 text-[10px] text-white-dim/50 tracking-wider">
                상담 예약은 로그인 후 진행 가능합니다.
              </p>
            </div>

          </div>
        </section>

        {/* Agency Style Fat Footer */}
        <Footer />
      </main>
    </>
  );
}
