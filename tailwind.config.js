let defaultTheme = require('tailwindcss/defaultTheme');
let colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  purge: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        orange: {
          css: {
            '--tw-prose-body': theme('colors.gray[800]'),
            '--tw-prose-headings': theme('colors.orange[600]'),
            '--tw-prose-lead': theme('colors.orange[600]'),
            '--tw-prose-links': theme('colors.orange[600]'),
            '--tw-prose-bold': theme('colors.orange[600]'),
            '--tw-prose-counters': theme('colors.orange[600]'),
            '--tw-prose-bullets': theme('colors.orange[600]'),
            '--tw-prose-hr': theme('colors.orange[600]'),
            '--tw-prose-quotes': theme('colors.orange[600]'),
            '--tw-prose-quote-borders': theme('colors.orange[600]'),
            '--tw-prose-captions': theme('colors.orange[600]'),
            '--tw-prose-code': theme('colors.orange[600]'),
            '--tw-prose-pre-code': theme('colors.orange[600]'),
            '--tw-prose-pre-bg': theme('colors.orange[600]'),
            '--tw-prose-th-borders': theme('colors.orange[600]'),
            '--tw-prose-td-borders': theme('colors.orange[600]'),
          },
        },
      }),
      backgroundImage: {
        main: 'url("/assets/bg.webp")',
      },
      colors: {
        gray: colors.neutral,
      },
      fontWeight: ['hover', 'focus'],
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT:
          '0 1px 4px 0 rgba(0, 0, 0, 0.09), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
        padding: 'padding',
        wp: 'width, padding',
        border: 'border-color',
        radius: 'border-radius',
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-out-down': {
          from: {
            opacity: '1',
            transform: 'translateY(0px)',
          },
          to: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-out-up': {
          from: {
            opacity: '1',
            transform: 'translateY(0px)',
          },
          to: {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'fade-out': {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'fade-out-down': 'fade-out-down 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-out-up': 'fade-out-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('tw-elements/dist/plugin'),
    require("@tailwindcss/forms"),
  ],
};
