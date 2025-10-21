/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#121212',
        'dark-secondary': '#1e1e1e',
        'dark-accent': '#bb86fc',
        'dark-card': '#2c2c2c',
        'dark-input': '#3c3c3c',
        'dark-border': '#333333',
        'dark-text': '#e1e1e1',
      },
    },
  },
  plugins: [],
};