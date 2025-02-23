/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.js',
  ],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    options: {
      safelist: ['bg-blue-50', 'text-blue-500', 'bg-gray-200', 'animate-pulse'],
    },
  },
  darkMode: 'class',
  theme: {
    screens: {
      mobile: '640px', // 모바일 (기존 360px -> 640px)
      tablet: '1024px', // 태블릿 (기존 768px -> 1024px)
      desktop: '1440px', // PC (기존 1280px -> 1440px)
    },
    extend: {
      colors: {
        transparent: 'transparent',
        bgWhite: '#f1f5f9',
        ftWhite: '#e5e7eb',
        cardFtBlack: '#27272a',
        ftBlack: '#171717',
        ftBlue: '#2657A6',
        ftGray: '#788699',
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: 0,
          },
        },
        spin: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        down: {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        right: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      },
      animation: {
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        spin: 'spin 1s linear infinite',
        down: 'down 0.3s ease-out',
        right: 'right 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('flowbite/plugin'), require('@tailwindcss/aspect-ratio')],
};
