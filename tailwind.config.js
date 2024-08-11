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
        bg: '#f1e5d4',
        card: '#fffcf0',
        dark: '#1c2730',
        accent: '#ecd2bf',
        secondary: '#c0b6b330',
        success: '#1fec85',
        primary: '#6ec3e2',
        border: '#d4cfcd',
        disabled: '#ecececb5',
        form: '#f8f7f7',
        muted: '#c7c9d0'
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Nunito"', 'sans-serif']
      }
    },
    screens: {
      sm: {'max': '562px'},
      md: {'max': '767px'},
      lg: {'max': '992px'},
      large: '992px',
      medium: '768px',
    }
  },
  plugins: [],
};
