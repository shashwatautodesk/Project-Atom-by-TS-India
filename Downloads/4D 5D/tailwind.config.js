/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Autodesk Brand Colors
        'autodesk-black': '#0D0D0D',
        'autodesk-white': '#FFFFFF',
        'hello-yellow': '#FED42D',
        'autodesk-gray': {
          50: '#F7F7F7',
          100: '#E3E3E3',
          200: '#C8C8C8',
          300: '#A4A4A4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#2D2D2D',
        },
        // Secondary colors for visual distinction
        'autodesk-blue': '#00B0F0',
        'autodesk-teal': '#00D4D4',
        'autodesk-orange': '#FF6E3A',
      },
    },
  },
  plugins: [],
}
