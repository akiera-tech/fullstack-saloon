import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF7EF",
        cream: "#FFF8EE",
        navy: {
          50: "#EEF2FF",
          100: "#DBE4FF",
          200: "#B8C7F5",
          300: "#8EA3E8",
          400: "#647BD4",
          500: "#4058B8",
          600: "#263E93",
          700: "#182F73",
          800: "#102459",
          900: "#0B1838"
        },
        rose: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#E85D75",
          600: "#BE3F55"
        },
        saffron: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C"
        },
        gold: "#C89B3C"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        premium: "0 24px 80px rgba(16, 36, 89, 0.14)"
      }
    },
  },
  plugins: [],
};

export default config;
