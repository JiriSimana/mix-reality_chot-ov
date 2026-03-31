/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8",   // Mixreality Blue (strong, legible blue)
        'primary-light': "#3b82f6", 
        neutralBg: "#FAF9F6",
        borderLight: "#E5E5E5",
        textDefault: "#2c2c2c",
        textMuted: "#6b7280",
        success: "#22c55e",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
