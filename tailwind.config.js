/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paytrack: {
          ink: '#0c1222',
          navy: '#0f172a',
          charcoal: '#1e293b',
          teal: '#0d9488',
          'teal-bright': '#2dd4bf',
          emerald: '#059669',
          sky: '#0ea5e9',
          soft: '#ecfdf5',
          'soft-dark': '#134e4a',
        },
        brand: {
          dark: '#0B132B',
          DEFAULT: '#1C2541',
          light: '#3A506B',
        },
        accent: {
          green: '#47A992',
          light: '#73C2AE',
          /** PayTrack UI primary */
          purple: '#5E5CE6',
          'purple-soft': '#E8E7FD',
        },
        surface: {
          cream: '#FBF9F6',
          card: '#FFFFFF',
        },
        category: {
          food: '#E85D5D',
          transport: '#4A90D9',
          subscriptions: '#5E5CE6',
          hangouts: '#E6B84D',
        },
        warning: {
          bg: '#FFF4E6',
          border: '#F0C078',
          text: '#B45309',
          icon: '#EA580C',
        },
        background: '#FBF9F6'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
