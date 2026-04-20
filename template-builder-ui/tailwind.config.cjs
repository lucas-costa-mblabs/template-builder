/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.{ts,tsx}',
    '!./node_modules/**',
    '!./dist/**',
  ],
  theme: { extend: {} },
  plugins: [],
}
