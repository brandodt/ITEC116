/** @type {import('tailwindcss').Config} */
export default {
    // Tailwind 4 uses contentless mode; only theme/plugins are needed.
    theme: {
        extend: {
            colors: {
                // Dark theme base colors
                'dark-primary': '#0f172a',
                'dark-secondary': '#1e293b',
                'dark-accent': '#10b981',
                'dark-card': '#1e293b',
                'dark-input': '#0f172a',
                'dark-border': '#334155',
                'dark-text': '#e2e8f0',
                
                // Organizer theme - Emerald/Teal
                'organizer': {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                
                // Admin theme - Indigo/Deep Slate
                'admin': {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                
                // Attendee theme - Sky Blue/Violet
                'attendee': {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            animation: {
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'slide-in-top': 'slide-in-top 0.3s ease-out',
                'fade-in': 'fade-in 0.2s ease-out',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
            },
            keyframes: {
                'slide-in-right': {
                    from: { transform: 'translateX(100%)', opacity: '0' },
                    to: { transform: 'translateX(0)', opacity: '1' },
                },
                'slide-in-top': {
                    from: { transform: 'translateY(-20px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)' },
                    '50%': { boxShadow: '0 0 20px 10px rgba(16, 185, 129, 0)' },
                },
            },
        },
    },
    plugins: {},
};

