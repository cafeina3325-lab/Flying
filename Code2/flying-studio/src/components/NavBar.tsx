"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Genre", href: "/genre" }, // Redirects to genre section logic usually, but here we link page
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
];

export default function NavBar() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed top-0 right-0 w-[60%] lg:w-[50%] h-24 z-[9990] hidden md:flex items-center justify-end pr-8 pointer-events-none"
            style={{
                background: `linear-gradient(to right, 
                    rgba(11, 20, 17, 0) 0%, 
                    rgba(11, 20, 17, 0.3) 30%, 
                    rgba(11, 20, 17, 0.5) 50%, 
                    rgba(11, 20, 17, 0.55) 55%, 
                    rgba(11, 20, 17, 0.70) 100%
                )`
            }}
        >
            {/* 
              Pointer Events: 
              Container is pointer-events-none to let clicks pass through the transparent part (left side).
              Inner content must be pointer-events-auto.
            */}
            <ul className="flex items-center gap-8 pointer-events-auto">
                {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;

                    // Hide Home link if we are already on the home page
                    if (link.label === "Home" && pathname === "/") {
                        return null;
                    }

                    return (
                        <li key={link.label}>
                            <Link
                                href={link.href}
                                className={`text-lg uppercase tracking-[0.2em] transition-all duration-300 relative ${isActive
                                    ? "font-extrabold text-[#D6BE8A] drop-shadow-[0_0_10px_rgba(214,190,138,0.6)] after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[3px] after:bg-[#D6BE8A] after:blur-[2px] after:shadow-[0_0_10px_#D6BE8A]"
                                    : "font-medium text-white-dim hover:text-white-main hover:scale-105 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
