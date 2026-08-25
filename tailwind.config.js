/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ECFDF5',  // Emerald 50
          100: '#D1FAE5', // Emerald 100
          200: '#A7F3D0', // Emerald 200
          500: '#10B981', // Emerald 500
          600: '#059669', // Emerald 600
          700: '#047857', // Emerald 700 (User Request)
          800: '#047857', // Primary Brand (Emerald 700)
          900: '#065F46', // Emerald 800
          950: '#064E3B', // Emerald 900
        },
        surface: {
          50: '#FFFFFF',
          100: '#F8F9FA',
          200: '#F4F4F6',
          300: '#E2E2E7',
          400: '#93959F',
          500: '#686B78',
          900: '#02060C',
        },
        accent: {
          500: '#FC8019', // Swiggy Orange
          600: '#E56D0C',
        }
      },
      fontFamily: {
        sans: ['Gilroy', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(2, 6, 12, 0.04), 0 1px 2px -1px rgba(2, 6, 12, 0.04)',
        'card-hover': '0 4px 14px 0 rgba(2, 6, 12, 0.08)',
        'float': '0 8px 24px -4px rgba(4, 120, 87, 0.35)', // Emerald shadow
        'sheet': '0 -4px 16px -2px rgba(2, 6, 12, 0.06)',
      }
    },
  },
  plugins: [],
}
