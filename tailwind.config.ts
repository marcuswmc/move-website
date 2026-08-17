import type { Config } from "tailwindcss";

const config: Config = {
  // lib/ entra porque lib/palette.ts guarda as classes das superfícies da marca.
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sistema cromático completo do guia oficial (docs/brand-guide-cores.md).
        // A redução anterior a 5 tokens foi revertida em 2026-08-13: as cores de apoio
        // voltam para dar identidade própria a ecossistemas e categorias nas listagens.
        // Antes de combinar fundo + texto, consulte a tabela de contraste do guia —
        // ela está codificada em lib/palette.ts, use de lá em vez de improvisar.
        move: {
          // Base
          black: "#000000", // Preto — uso EXCLUSIVO em tipografia, nunca como fundo dominante
          offwhite: "#F2F2F2", // Off White — fundo neutro padrão
          gray: "#F2F2F2", // alias de Off White
          // Principais
          purple: "#54355D", // Açaí — ink, superfícies escuras
          yellow: "#FACA77", // Ipê — CTAs, destaques, focus states
          // Apoio
          periwinkle: "#CCACFF", // Lavanda
          coral: "#DF6E6E", // Goiaba
          sand: "#CEB187", // Areia
          light: "#FBFFB1", // Luz — só acento gráfico pequeno, NUNCA fundo de componente
          mint: "#CDCE74", // Capim
          green: "#234625", // Mata
          line: "rgba(84, 53, 93, 0.12)"
        }
      },
      fontFamily: {
        sans: ["var(--font-raleway)", "Raleway", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"]
      },
      fontSize: {
        eyebrow: ["0.8125rem", { lineHeight: "1.3", letterSpacing: "0.16em" }],
        // Teto em 5rem (80px): acima disso os títulos de página atuais passam a
        // quebrar em três linhas. Medido com os títulos reais, não estimado.
        "display-1": ["clamp(2.25rem, 1.6rem + 3vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-2": ["clamp(2.25rem, 1.75rem + 2.5vw, 4.25rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-3": ["clamp(1.75rem, 1.5rem + 1.25vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "body-lg": ["clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)", { lineHeight: "1.6" }]
      },
      borderRadius: {
        soft: "8px"
      },
      boxShadow: {
        editorial: "0 18px 50px rgba(84, 53, 93, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
