/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
    },
    extend: {
      colors: {
        brand: {
          teal: '#0F766E',
          tealLight: '#CCFBF1',
          amber: '#D97706',
          cream: '#FEF3C7',
          ink: '#1E293B',
          muted: '#475569',
          warm: '#FFFCF7',
          section: '#F8FAFC',
          border: '#E2E8F0',
          line: '#06C755',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
        'serif-jp': ['"Noto Serif JP"', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
        lift: '0 24px 60px rgba(15, 118, 110, 0.16)',
      },
      borderRadius: {
        component: '8px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 700ms ease-out both',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
