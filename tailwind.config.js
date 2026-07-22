/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // primaire identity #2DBFA6, décliné en famille pastel
        teal: {
          DEFAULT: '#2DBFA6',
          light: '#5FD1BB',
          dark: '#1F8F7B',
          pale: '#DEF3EE',
        },
        // secondaire identity #6B5640, décliné en famille pastel
        caramel: {
          DEFAULT: '#6B5640',
          light: '#8A7057',
          dark: '#4E3D2C',
        },
        // fond clair de base (remplace l'obsidian de la DA luxe)
        cream: {
          DEFAULT: '#FBF8F2',
          soft: '#F3EEE3',
          dark: '#E9E1D2',
        },
        // ancrage sombre (footer, CTA) — vert profond dérivé du teal
        deep: {
          DEFAULT: '#163C33',
          light: '#1E4A3F',
        },
        // texte sur fond clair
        ink: {
          DEFAULT: '#1C2E29',
          soft: '#5C6F68',
        },
      },
      fontFamily: {
        chewy: ['Chewy', 'cursive'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-xl': '0.3em',
        'widest-2xl': '0.45em',
      },
      borderRadius: {
        '4xl': '1.75rem',
        '5xl': '2.25rem',
        '6xl': '2.75rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'line-grow': 'lineGrow 1s ease-out forwards',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        lineGrow: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
