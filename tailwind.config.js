/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        miles: {
          50: "#e6f0f8", // Lightest shade
          100: "#cce0f2", // Very light shade
          200: "#99c1e5", // Light shade
          300: "#66a3d9", // Medium-light shade
          400: "#3385cc", // Slightly lighter than base
          500: "#176298", // Base color (provided)
          600: "#155780", // Darker shade
          700: "#124b68", // Dark shade
          800: "#0f3f50", // Very dark shade
          900: "#0d333f", // Darkest shade
        },
      },
      fontFamily: {
        Ranade: ["Ranade", "sans-serif"],
        Satoshi: ["Satoshi", "sans-serif"],
        Supreme: ["Supreme", "sans-serif"],
      },
      screens: {
        mobile: "340px",
        // => @media (min-width: 640px) { ... }
        ipad: "658px",
        tablet: "768px",
        // => @media (min-width: 768px) { ... }

        laptop: "1024px",
        // => @media (min-width: 1024px) { ... }

        desktop: "1280px",
        // => @media (min-width: 1280px) { ... }

        bigDisplay: "1536px",
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [],
};
