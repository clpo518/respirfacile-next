/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f2f5f1",
          100: "#dde5da",
          200: "#b9c4ad",
          300: "#91a285",
          400: "#6d8062",
          500: "#4a5d43",
          600: "#3b4d35",
          700: "#2d3d28",
          800: "#1f2a1c",
          900: "#121a10",
        },
        beige: {
          50: "#fdfcfa",
          100: "#fbf8f2",
          200: "#f7f3ec",
          300: "#f0e9dc",
          400: "#e5d9c8",
          500: "#d4c4a8",
        },
        copper: {
          50: "#fdf6ef",
          100: "#fae8d4",
          200: "#f5d0a9",
          300: "#e8b07a",
          400: "#d4924d",
          500: "#b87333",
          600: "#9a5f28",
          700: "#7c4c1e",
          800: "#5e3a16",
          900: "#40280f",
        },
        sage: {
          100: "#edf0ea",
          200: "#dce3d8",
          300: "#c4d0be",
          400: "#b9c4ad",
          500: "#a0b098",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "forest": "0 4px 24px rgba(74, 93, 67, 0.15)",
        "forest-lg": "0 8px 48px rgba(74, 93, 67, 0.2)",
        "beige": "0 4px 24px rgba(74, 93, 67, 0.08)",
      },
    },
  },
  plugins: [],
};
