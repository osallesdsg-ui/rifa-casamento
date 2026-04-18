/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#1a1a2e',
          100: '#16162a',
          200: '#121226',
          300: '#0e0e22',
          400: '#0a0a1e',
          500: '#0a0a0f',
          600: '#08080d',
          700: '#06060b',
          800: '#040409',
          900: '#020207',
        },
        gold: {
          100: '#f5e6b8',
          200: '#e8c96d',
          300: '#d4b85a',
          400: '#c9a84c',
          500: '#b8953f',
          600: '#a68535',
          700: '#8c7130',
          800: '#735d28',
          900: '#5a4820',
        },
        cream: '#e8e0d5',
        sand: '#c5b99a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(201, 168, 76, 0.25)',
        'gold-lg': '0 4px 30px rgba(201, 168, 76, 0.4)',
        'card': '0 2px 20px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'shimmer-ticket': 'shimmer-ticket 2s infinite',
      },
      keyframes: {
        'shimmer-ticket': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};