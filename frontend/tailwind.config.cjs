/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // 👇 AQUÍ ESTÁ LA MAGIA: Apuntamos manualmente a los archivos de la librería
    "node_modules/flowbite-react/dist/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
      },
    },
  },
  plugins: [
    // 👇 Usamos el plugin directo del núcleo
    require("flowbite/plugin"),
  ],
};
