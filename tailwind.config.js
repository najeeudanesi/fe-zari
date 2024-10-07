/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: '#F37A50',
        'primary-alt': '#FFF9F7'
      },
      fontSize: {
        '4xs': '.525rem',
        '3xs': '.6rem',
        '2xs': '.675rem'
      },
      minWidth: ({ theme }) => ({ ...theme('maxWidth'), ...theme('spacing') }),
      minHeight: ({ theme }) => ({ ...theme('spacing') })
    }
  },
  plugins: []
}
