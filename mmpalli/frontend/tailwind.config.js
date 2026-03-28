/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: { 50: '#FFF7ED', 500: '#F97316', 700: '#C2410C' },
        trustBlue: { 50: '#EFF6FF', 900: '#1E3A5F' }
      }
    },
  },
  plugins: [],
}