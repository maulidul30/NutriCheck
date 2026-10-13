// Konfigurasi Tailwind CSS (harus dimuat setelah script CDN Tailwind)
tailwind.config = {
    theme: {
        extend: {
            colors: {
                emerald: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                },
                teal: {
                    500: '#14b8a6',
                    600: '#0d9488',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        }
    }
};
