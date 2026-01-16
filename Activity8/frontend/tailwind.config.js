/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind 4 uses contentless mode; only theme/plugins are needed.
  theme: {
    extend: {
      colors: {
        'dark-primary': '#121212',
        'dark-secondary': '#1e1e1e',
        'dark-accent': '#bb86fc',
        'dark-card': '#2c2c2c',
        'dark-input': '#3c3c3c',
        'dark-border': '#2a2a2a',
        'dark-text': '#e1e1e1',
      },
    },
  },
  plugins: {},
}
