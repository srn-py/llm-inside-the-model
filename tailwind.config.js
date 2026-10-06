// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "DM Sans",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "IBM Plex Mono",
          "JetBrains Mono",
          "monospace",
        ],
      },
      colors: {
        paper: "#F7F1E5",
        ink: "#111111",
        accent: "#C65D3A",
      },
    },
  },
  plugins: [],
};