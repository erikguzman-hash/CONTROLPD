import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        'hgio-blue': {
          DEFAULT: '#153054',
          dark: '#102440',
        },
        'hgio-green': {
          DEFAULT: '#4c9200',
          light: '#80ba27',
        },
        'hgio-gray': '#858482',
      },
    },
  },
  plugins: [],
}
export default config
