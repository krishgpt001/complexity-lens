import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#1e1e2e", panel: "#252538", line: "#3a3a55", electric: "#89b4fa", green: "#a6e3a1", warn: "#f38ba8" },
      fontFamily: { sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"], mono: ["var(--font-jetbrains)", "ui-monospace"] },
    },
  },
  plugins: [],
};
export default config;
