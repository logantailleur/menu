/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Seahawks-inspired Navy Blue
        navy: {
          50: '#e6f0f7',
          100: '#cce0ef',
          200: '#99c1df',
          300: '#66a2cf',
          400: '#3383bf',
          500: '#0064af', // Primary navy
          600: '#00508c',
          700: '#003c69',
          800: '#002846',
          900: '#001423', // Deep navy
        },
        // Seahawks-inspired Action Green
        action: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#b9f9cf',
          300: '#86f6b7',
          400: '#4dee9f',
          500: '#69BE28', // Action green
          600: '#52a320',
          700: '#3d7a18',
          800: '#285110',
          900: '#142808',
        },
      },
    },
  },
  plugins: [],
}
