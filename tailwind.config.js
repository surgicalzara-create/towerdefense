/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        ocean: {
          900: '#0f172a',
          800: '#1e293b',
        },
        tropical: {
          400: '#fbbf24', // Amber
          500: '#f59e0b',
          600: '#d97706',
        },
        lava: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        palm: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
      },
    },
  },
  plugins: [],
}
