/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Palette extraite du logo (lucky_copie.pdf) ──────────────────
        // primaire : le vert du lettrage « LE RAYON VERT », avec ses nuances
        forest: {
          DEFAULT: '#016B5B',   // bleu-vert médian du dégradé de la typo
          light:   '#0E9280',   // éclairci — hovers, accents, survols
          dark:    '#014539',   // le plus profond du dégradé
          pale:    '#E0EDEA',   // teinte très claire — fonds, pastilles
        },
        // secondaire : l'or plein du mot « HÔTEL »
        gold: {
          DEFAULT: '#BF893B',   // valeur exacte du logo
          light:   '#D4A461',
          dark:    '#93672A',   // assombri pour rester lisible en texte / bouton
          deep:    '#7A5522',
          soft:    '#E0B778',   // or éclairci — lisible sur les fonds verts sombres
        },
        // fond : le crème exact du logo
        cream: {
          DEFAULT: '#FAF5EF',   // valeur exacte du logo
          soft:    '#F3EBE0',
          dark:    '#E8DDCE',
        },
        // ancrage sombre (footer, CTA) — vert forêt poussé au plus profond
        deep: {
          DEFAULT: '#04302A',   // texte et voiles
          light:   '#014539',
          panel:   '#015B4C',   // grands aplats pleine largeur (Avis, CTA)
        },
        // texte sur fond clair — encre légèrement verdie
        ink: {
          DEFAULT: '#172C29',
          soft:    '#5A6B68',
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
