/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,svelte}"],
  theme: {
    extend: {
      animation: {
        breathe: "breathe 6s ease-in-out",
      },
      keyframes: {
        breathe: {
          "0%": { transform: "rotate3d(1, 1, 1, -40deg)" },
          "100%": { transform: "rotate3d(1, 1, 1, 20deg)" },
        },
      },
    },
  },
  plugins: [],
};
