/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'background': '#121212',
                'card': '#1a1a1a',
                'primary': '#00a2ff',
                'secondary': '#2563eb',
                'text': '#f5f5f5',
                'light': '#c4cfde',
                'darker': '#0d0d0d'
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
