/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
          accent: '#10B981',
          accentHover: '#059669',
          danger: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6'
        }
      }
    },
  },
  plugins: [],
}
