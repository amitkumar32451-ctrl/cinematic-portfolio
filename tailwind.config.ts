import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair-display)", "serif"],
      },
      colors: {
        background: "#0d0d0d",
        foreground: "#ffffff",
        accent: "#ff6b35",
      },
    },
  },
  plugins: [],
};
export default config;
