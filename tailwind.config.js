// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#000000', // Background
        secondary: '#FFFFFF', // Text
        accent: '#00ffe0', // Highlights and buttons
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'], // 👈 Orbitron font
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(180deg, #000000, #083134, #0c241e)',
      },
    },
  },
  plugins: [],
};