/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        coal: '#07090d',
        graphite: '#10151f',
        steel: '#1c2533',
        volt: '#47f59b',
        gold: '#f0c866',
        electric: '#4f8cff',
      },
      boxShadow: {
        glow: '0 18px 80px rgba(71, 245, 155, 0.14)',
        card: '0 18px 50px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
}
