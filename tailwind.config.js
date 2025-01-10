/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Consolas", "Monaco", "monospace"],
      },
      colors: {
        "primary-bg": "#1a1e2d",
        "secondary-bg": "#242b3d",
        "primary-text": "#ffffff",
        "secondary-text": "#8b8f9a",
        "accent-green": "#4cd964",
        "profit-green": "#1cb954",
        "button-green": "#2c4c3b",
        "negative-red": "#ff3b30",
        "market-purple": {
          DEFAULT: "#9f7aea",
          light: "#805ad5",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
