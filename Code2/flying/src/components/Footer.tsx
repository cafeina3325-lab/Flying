import Link from "next/link";
import { NAV_LINKS } from "@/app/constants";

export default function Footer() {
    return (
        <footer className="w-full bg-black py-24 border-t border-white/5 relative z-10">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">

                {/* Col 1: Brand Identity (Span 4) */}
                <div className="md:col-span-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-4xl sm:text-6xl font-black text-white-main tracking-tighter mb-6 inline-flex items-start drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                            FLYING
                            <span className="text-gold-antique text-lg sm:text-2xl ml-1 mt-1 drop-shadow-none">®</span>
                        </h2>
                        <p className="text-white-dim text-sm tracking-widest uppercase font-light leading-relaxed max-w-xs">
                            Premium Tattoo Artistry<br />
                            Based in Seoul, Korea.
                        </p>
                    </div>
                    <div className="mt-12 md:mt-0">
                        <span className="text-gold-soft/50 text-xs tracking-widest">EST. 2024</span>
                    </div>
                </div>

                {/* Col 2: Navigation Links (Span 4) */}
                <div className="hidden md:block md:col-span-4 md:pl-8">
                    <h3 className="text-[#D6BE8A] text-xs font-bold tracking-[0.2em] uppercase mb-8 opacity-70">
                        Menu
                    </h3>
                    <nav className="flex flex-col space-y-4">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-2xl sm:text-3xl font-light text-white-main hover:text-gold-antique transition-colors tracking-wide w-max"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Col 3: Social & Legal (Span 4) */}
                <div className="md:col-span-4 flex flex-col justify-between md:items-end text-left md:text-right">
                    <div className="flex flex-col items-start md:items-end space-y-6">
                        <h3 className="text-[#D6BE8A] text-xs font-bold tracking-[0.2em] uppercase mb-2 opacity-70">
                            Social
                        </h3>
                        <div className="flex gap-6">
                            <a href="#" className="text-white-dim hover:text-gold-antique text-sm tracking-widest uppercase transition-colors px-2 py-1 border border-white/10 hover:border-gold-antique rounded-full">
                                Instagram
                            </a>
                            <a href="#" className="text-white-dim hover:text-gold-antique text-sm tracking-widest uppercase transition-colors px-2 py-1 border border-white/10 hover:border-gold-antique rounded-full">
                                Facebook
                            </a>
                        </div>

                        {/* Business Info (Restored Content) */}
                        <div className="mt-8 text-[10px] text-white-dim/60 space-y-1 tracking-wider leading-relaxed">
                            <p>FLYING STUDIO | OWNER: KIM DO-HYUN</p>
                            <p>BUSINESS LICENSE: 123-45-67890</p>
                            <p>ADDRESS: SEOUL, KOREA</p>
                            <p>TEL: 010-1234-5678</p>
                        </div>
                    </div>

                    <div className="mt-16 md:mt-0 space-y-2">
                        <p className="text-white-dim/40 text-[10px] uppercase tracking-widest">
                            © 2025 Flying Tattoo Studio.
                        </p>
                        <div className="flex gap-4 md:justify-end text-white-dim/40 text-[10px] uppercase tracking-widest">
                            <Link href="#" className="hover:text-white-main transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-white-main transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
