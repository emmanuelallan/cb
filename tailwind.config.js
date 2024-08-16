/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f5f5f5",
        card: "#ffffff",
        dark: "#222222",
        accent: "#ecd2bf",
        secondary: "#2222220d",
        success: "#1fec85",
        primary: "#6ec3e2",
        border: "#d4cfcd",
        disabled: "#ecececb5",
        form: "#f8f7f7",
        muted: "#c7c9d0",
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Nunito"', "sans-serif"],
      },
    },
    screens: {
      sm: { max: "562px" },
      md: { max: "767px" },
      lg: { max: "992px" },
      large: "992px",
      medium: "768px",
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
