/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: { DEFAULT: '#1B2A4A', deep: '#121D34' },
        marigold: { DEFAULT: '#E8A33D', soft: '#F4C876' },
        vermilion: '#8C2F39',
        ivory: { DEFAULT: '#F6EFE2', dim: '#EDE3D0' },
        teal: '#1F6F6B',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
