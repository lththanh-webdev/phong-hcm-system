/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        army: {
          red: '#b91c1c',      // Đỏ cờ
          gold: '#eab308',     // Vàng sao
          dark: '#1e293b',     // Tông tối sang trọng
          accent: '#15803d'   // Xanh quân đội
        }
      }
    },
  },
  plugins: [],
}