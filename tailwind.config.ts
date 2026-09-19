import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#060615",
        panel: "#12122c",
        line: "#2f2f5e",
        electric: "#8b5cf6",
        cyan: "#22d3ee",
        magenta: "#ec4899",
        green: "#2dd4bf",
        warn: "#fb4d9e",
      },
      fontFamily: { sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"], mono: ["var(--font-jetbrains)", "ui-monospace"] },
      animation: {
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 14s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
