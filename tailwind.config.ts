import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Public site (light editorial)
        ink: "#11140f",
        paper: "#f3f4ee",
        panel: "#e9ebe2",
        raised: "#ffffff",
        line: "#d5d9ce",
        signal: "#b7f56a",
        muted: "#596157",
        forest: "#1d4a2a",
        flare: "#e6ffb8",
        danger: "#a32218",
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
