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
        "doibrand-dark": "#351C1B",
        "doibrand-gold": "#C48A4E",
        "doibrand-light": "#FAF8F5",
        "doibrand-accent": "#A95E35",
      },
      fontFamily: {
        bengali: ["var(--font-hind-siliguri)", "sans-serif"],
        hind: ["var(--font-hind-siliguri)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
