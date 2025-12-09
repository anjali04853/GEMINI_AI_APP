/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#6C63FF',
          darkPurple: '#5a52d5',
          turquoise: '#4ECDC4',
          pink: '#FF6B9D',
          lavender: '#E6E6FA',
          offWhite: '#F9FAFB',
          sky: '#0EA5E9',
          yellow: '#FCD34D',
          charcoal: '#2D3748',
          darkCharcoal: '#1A202C',
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(108, 99, 255, 0.5)' },
          '50%': { opacity: .8, boxShadow: '0 0 10px rgba(108, 99, 255, 0.2)' },
        }
      }
    }
  },
  plugins: [],
}