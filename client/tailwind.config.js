import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */

const COLORS = [
  "#ff6384",
  "#36a2eb",
  "#ffcd56",
  "#8e43e7",
  "#ff6c5f",
  "#1cc7d0",
  "#3369e7",
  "#b84592",
];

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [...COLORS.map((color) => `bg-${color}`)],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
