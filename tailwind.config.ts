import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        move: {
          purple: "#230343",
          periwinkle: "#6268D9",
          green: "#004A3D",
          mint: "#A2DAA8",
          yellow: "#F8E44B",
          offwhite: "#F2F2F2",
          black: "#1A1A1A",
          gray: "#F2F2F2",
          line: "rgba(35, 3, 67, 0.12)"
        }
      },
      fontFamily: {
        sans: ["var(--font-raleway)", "Raleway", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"]
      },
      fontSize: {
        eyebrow: ["0.8125rem", { lineHeight: "1.3", letterSpacing: "0.16em" }],
        "display-1": ["clamp(2.75rem, 2rem + 3.5vw, 5.75rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-2": ["clamp(2.25rem, 1.75rem + 2.5vw, 4.25rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-3": ["clamp(1.75rem, 1.5rem + 1.25vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "body-lg": ["clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)", { lineHeight: "1.6" }]
      },
      borderRadius: {
        soft: "8px"
      },
      boxShadow: {
        editorial: "0 18px 50px rgba(35, 3, 67, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
