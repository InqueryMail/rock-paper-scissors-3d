/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "cyber-pink": "#FF00FF",
        "cyber-blue": "#00F0FF",
        "cyber-purple": "#9D00FF",
        "cyber-dark": "#0A0A0F",
        "cyber-darker": "#050507",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        glow: {
          "0%": {
            "box-shadow": "0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 15px #FF00FF",
          },
          "100%": {
            "box-shadow":
              "0 0 10px #00F0FF, 0 0 20px #00F0FF, 0 0 30px #00F0FF",
          },
        },
      },
      backgroundImage: {
        "cyber-grid":
          "linear-gradient(rgba(10, 10, 15, 0.9), rgba(10, 10, 15, 0.9)), url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239D00FF' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
