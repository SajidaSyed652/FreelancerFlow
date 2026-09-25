/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#F6F0E8',
          surface: '#FFFDF9',
          'surface-secondary': '#EEE6F5',
          border: '#DED3E3',
        },
        lavender: {
          50: '#FAF7FC',
          100: '#F3EDF9',
          200: '#EEE6F5',
          300: '#D8CDE8',
          400: '#B9A7D9',
          500: '#9B83BD',
          600: '#8F78B5',
          700: '#765B9E',
          800: '#5F4682',
          900: '#483563',
        },
        plum: {
          DEFAULT: '#302A35',
          secondary: '#6F6675',
          muted: '#968D99',
          dark: '#1F1A24',
        },
        brand: {
          50: '#FAF7FC',
          100: '#F3EDF9',
          200: '#EEE6F5',
          300: '#D8CDE8',
          400: '#B9A7D9',
          500: '#9B83BD',
          600: '#765B9E',
          700: '#5F4682',
          800: '#483563',
          900: '#302A35',
          950: '#1F1A24',
        }
      },
      boxShadow: {
        'glow-purple': '0 0 16px rgba(155, 131, 189, 0.35)',
        'glow-cyan': '0 0 16px rgba(185, 167, 217, 0.35)',
        'soft-card': '0 4px 20px -2px rgba(48, 42, 53, 0.05), 0 2px 6px -1px rgba(48, 42, 53, 0.03)',
        'soft-card-hover': '0 12px 30px -4px rgba(120, 95, 158, 0.12), 0 4px 10px -2px rgba(48, 42, 53, 0.04)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
