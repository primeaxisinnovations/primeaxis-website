import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './types/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        deep: '#151C2E',
        teal: '#485778',
        'teal-mid': '#5E719A',
        gold: '#BF9F66',
        'gold-light': '#D4B880',
        cream: '#F4F1EB',
        'cream-dark': '#E5E0D5',
        ink: '#0D1F28',
        muted: '#5C7A87',
        border: '#DDD9D0',
        stripe: '#EEF3F5',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', "'Courier New'", 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 5.5vw, 5rem)', { lineHeight: '1.05' }],
        'display-lg': ['clamp(2.2rem, 4vw, 3.5rem)', { lineHeight: '1.1' }],
        'display-md': ['clamp(1.6rem, 2.5vw, 2.2rem)', { lineHeight: '1.2' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        card: '0 2px 16px rgba(13,31,40,0.06), 0 1px 4px rgba(13,31,40,0.04)',
        'card-hover': '0 8px 32px rgba(13,31,40,0.12), 0 2px 8px rgba(13,31,40,0.06)',
        gold: '0 6px 24px rgba(191,159,102,0.28)',
      },
      borderRadius: {
        sm2: '3px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.65s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-right': 'slide-right 0.6s ease-out',
        'ken-burns': 'ken-burns 7s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
