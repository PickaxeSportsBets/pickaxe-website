/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
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
        // Core UI Colors with Light/Dark variants
        "primary-bg": {
          light: "#ffffff",
          dark: "#1a1e2d",
        },
        "secondary-bg": {
          light: "#f1f5f9",
          dark: "#2A3247",
        },
        "secondary-bg-hover": {
          light: "#EAF0F6",
          dark: "#313B53",
        },
        "tertiary-bg": {
          light: "#DBE5F0",
          dark: "#3E4C6F",
        },
        "tertiary-bg-hover": {
          light: "#D0DDEB",
          dark: "#394565",
        },
        "primary-text": {
          light: "#0f172a",
          dark: "#ffffff",
        },
        "secondary-text": {
          light: "#475569",
          dark: "#C6C8CD",
        },

        // Accent Colors
        "accent-green": {
          light: "#22c55e",
          dark: "#4cd964",
        },
        "accent-green-hover": {
          light: "#16a34a",
          dark: "#85E595",
        },
        "profit-green": {
          light: "#15803d",
          dark: "#1cb954",
        },
        "button-green": {
          light: "#D0F5DD",
          dark: "#2c4c3b",
        },
        "button-green-hover": {
          light: "#bbf7d0",
          dark: "#3C6750",
        },
        "negative-red": {
          light: "#ef4444",
          dark: "#ff3b30",
        },
        "negative-red-hover": {
          light: "#dc2626",
          dark: "#FF8B85",
        },
        "market-purple": {
          light: "#a855f7",
          dark: "#9f7aea",
          "light-hover": "#9333ea",
          "dark-hover": "#805ad5",
        },

        // System Colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Chart Colors
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
