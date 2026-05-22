import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f7fb',
          100: '#edf0f7',
          200: '#d8deea',
          300: '#b8c3d8',
          400: '#8a98b5',
          500: '#627091',
          600: '#46536f',
          700: '#303a50',
          800: '#1b2232',
          900: '#0f1522',
        },
        sand: '#f5efe3',
        coral: '#ea6f61',
        teal: '#2f8f83',
        gold: '#d9a441',
      },
      boxShadow: {
        glow: '0 25px 50px -12px rgba(15, 21, 34, 0.24)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        dashboard: 'radial-gradient(circle at top left, rgba(47, 143, 131, 0.18), transparent 35%), radial-gradient(circle at top right, rgba(234, 111, 97, 0.14), transparent 28%), linear-gradient(180deg, #0f1522 0%, #11182a 42%, #f5efe3 42%, #f5efe3 100%)',
      },
      keyframes: {
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        riseIn: 'riseIn 0.45s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
