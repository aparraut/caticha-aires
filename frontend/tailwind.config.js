/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
           accent: '#38bdf8',
        },
        premium: {
          gold: '#d4af37',
          silver: '#c0c0c0',
          dark: '#050505',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backdropBlur: {
        'xs': '2px',
        'md': '10px',
        'lg': '20px',
        'xl': '40px',
      }
    },
  },
  plugins: [],
}
