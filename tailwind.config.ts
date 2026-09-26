import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0c0b",
        panel: "#101311",
        raised: "#161a17",
        line: "#2a302b",
        signal: "#b7f56a",
        paper: "#f2f4ef",
        muted: "#9ca59d",
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
      maxWidth: { shell: "1440px", copy: "68ch" },
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
