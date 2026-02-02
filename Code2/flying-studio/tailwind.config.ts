import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // 1. Dark Base
                "black-deep": "var(--bg-black-deep)",
                "forest-black": "var(--bg-forest-black)",
                "dark-moss": "var(--bg-dark-moss)",
                "soft-dark-green": "var(--bg-soft-dark-green)",
                "smoky-olive": "var(--bg-smoky-olive)",
                "card-dark": "var(--bg-card-dark)",
                "glass-dark": "var(--bg-glass-dark)",

                // 2. Ink Green
                "ink-dark": "var(--green-ink-dark)",
                "ink-main": "var(--green-ink-main)",
                "jade": "var(--green-jade)",
                "emerald-muted": "var(--green-emerald-muted)",
                "sage-light": "var(--green-sage-light)",
                "mist": "var(--green-mist)",

                // 3. Brown
                "brown-charcoal": "var(--brown-charcoal)",
                "brown-burnt-umber": "var(--brown-burnt-umber)",
                "brown-ink": "var(--brown-ink)",
                "brown-leather": "var(--brown-leather)",
                "brown-warm-earth": "var(--brown-warm-earth)",
                "brown-skin-shadow": "var(--brown-skin-shadow)",
                "brown-soft-sand": "var(--brown-soft-sand)",

                // 4. Gold
                "gold-ancient-dark": "var(--gold-ancient-dark)",
                "gold-aged": "var(--gold-aged)",
                "gold-antique": "var(--gold-antique)",
                "gold-soft": "var(--gold-soft)",
                "gold-glow-light": "var(--gold-glow-light)",
                "gold-highlight": "var(--gold-highlight)",
                // Gold effects
                "gold-glow-weak": "var(--gold-glow-weak)",
                "gold-glow-medium": "var(--gold-glow-medium)",
                "gold-glow-strong": "var(--gold-glow-strong)",

                // 5. Text
                "white-main": "var(--text-white-main)",
                "white-soft": "var(--text-white-soft)",
                "white-muted": "var(--text-white-muted)",
                "white-dim": "var(--text-white-dim)",
                "disabled": "var(--text-disabled)",

                // 6. Border (using colors for borders usually)
                "border-subtle": "var(--border-subtle)",
                "border-soft": "var(--border-soft)",
                "border-gold-soft": "var(--border-gold-soft)",
                "border-gold-strong": "var(--border-gold-strong)",

                // 7. Accents
                "red-deep": "var(--accent-red-deep)",
                "rust-orange": "var(--accent-rust-orange)",
                "ink-blue": "var(--accent-ink-blue)",
                "muted-purple": "var(--accent-muted-purple)",
                "blood-wine": "var(--accent-blood-wine)",

                // Backward compatibility (optional, better to let old ones break to find them?)
                // Mapping old background/foreground to new main
                background: "var(--bg-forest-black)",
                foreground: "var(--text-white-main)",
            },
            backgroundImage: {
                "gradient-dark-depth": "var(--gradient-dark-depth)",
                "gradient-green-depth": "var(--gradient-green-depth)",
                "gradient-gold-shine": "var(--gradient-gold-shine)",
                "gradient-event-highlight": "var(--gradient-event-highlight)",
            },
            boxShadow: {
                "deep": "var(--shadow-deep)",
                "gold-glow": "var(--shadow-gold-glow)",
                "soft-lift": "var(--shadow-soft-lift)",
            },
            // ANIMATION for SMOKE DRIFT
            animation: {
                "fog-drift-1": "fog-drift-1 45s ease-in-out infinite alternate",
                "fog-drift-2": "fog-drift-2 38s ease-in-out infinite alternate-reverse", // Slightly different timing/direction
                "fog-drift-3": "fog-drift-3 42s ease-in-out infinite alternate",
            },
            keyframes: {
                "fog-drift-1": {
                    "0%": { transform: "translate3d(0, 0, 0)" },
                    "100%": { transform: "translate3d(5%, -3%, 0)" }, // subtle drift
                },
                "fog-drift-2": {
                    "0%": { transform: "translate3d(2%, 2%, 0)" },
                    "100%": { transform: "translate3d(-3%, -2%, 0)" },
                },
                "fog-drift-3": {
                    "0%": { transform: "translate3d(-2%, 1%, 0)" },
                    "100%": { transform: "translate3d(3%, -3%, 0)" },
                }
            }
        },
    },
    plugins: [],
};
export default config;
