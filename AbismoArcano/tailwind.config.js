/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      // Define tu paleta de colores personalizada aquí
      colors: {
        'primary-dark-violet': '#2C2B3F', // Fondo principal: Gris oscuro violáceo
        'text-light-gray': '#EAEAEA',    // Texto principal: Gris claro cálido
        'accent-purple': '#6A5ACD',      // Color de acento: Morado profundo (ajustado ligeramente para mejor contraste)
        'button-golden': '#B8860B',      // Botones y enlaces: Dorado antiguo
        'hover-emerald-tint': '#4A8D8B', // Hover/activo: Verde esmeralda tenue (ajustado ligeramente para mejor contraste)
      },
    },
  },
  plugins: [],
}
