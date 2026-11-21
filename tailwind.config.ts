import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic channels preserve opacity utilities in both system themes.
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        raised: "rgb(var(--color-raised) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        signal: "rgb(var(--color-signal) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        forest: "rgb(var(--color-forest) / <alpha-value>)",
        flare: "rgb(var(--color-flare) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        // Admin dashboard (dark, existing)
        surface: "#0a0c0b",
        background: "#0a0c0b",
        primary: "#f2f4ef",
        secondary: "#9ca59d",
        "on-primary": "#0a0c0b",
        "on-surface": "#f2f4ef",
        "on-background": "#f2f4ef",
        "outline-variant": "#2a302b",
        "surface-container": "#101311",
        "surface-container-low": "#0d100e",
        "surface-container-high": "#161a17",
        "surface-container-highest": "#1c211d",
        error: "#ff8b82",
      },
      maxWidth: { shell: "1280px", copy: "68ch" },
      fontFamily: {
        sans: ["var(--font-geist)", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      transitionTimingFunction: { out: "cubic-bezier(0.16, 1, 0.3, 1)" },
    },
  },
  plugins: [],
};

export default config;
