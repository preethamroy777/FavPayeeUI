export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sg: {
          red: '#d1001b',
          black: '#1a1a1a',
          gray: '#f3f3f3',
          dark: '#2d2d2d',
          soft: '#6b7280',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
