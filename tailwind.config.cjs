/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shuffleCourier: {
          "0%": {
            transform: "translateY(0px)",
          },
          "10%": {
            transform: "translateY(-75px)",
          },
          "20%": {
            transform: "translateY(-150px)",
          },
          "30%": {
            transform: "translateY(-227.5px)",
          },
          "40%": {
            transform: "translateY(-303px)",
          },
          "50%": {
            transform: "translateY(-380px)",
          },
          "60%": {
            transform: "translateY(-455px)",
          },
          "70%": {
            transform: "translateY(-532.5px)",
          },
          "80%": {
            transform: "translateY(-607px)",
          },
          "90%": {
            transform: "translateY(-684px)",
          },
          "100%": {
            transform: "translateY(-760px)",
          },
        },
        shuffleCourierMobile: {
          "0%": {
            transform: "translateY(0px)",
          },
          "10%": {
            transform: "translateY(-63px)",
          },
          "20%": {
            transform: "translateY(-127px)",
          },
          "30%": {
            transform: "translateY(-191px)",
          },
          "40%": {
            transform: "translateY(-255px)",
          },
          "50%": {
            transform: "translateY(-319px)",
          },
          "60%": {
            transform: "translateY(-383px)",
          },
          "70%": {
            transform: "translateY(-447px)",
          },
          "80%": {
            transform: "translateY(-511px)",
          },
          "90%": {
            transform: "translateY(-575px)",
          },
          "100%": {
            transform: "translateY(-639px)",
          },
        },
      },

      animation: {
        shuffle: "shuffleCourier 20s ease-in-out infinite",
        shuffleMobile:"shuffleCourierMobile 20s ease-in-out infinite"
      },
    },
    fontFamily: {
      body: [
        "Inter",
        "Helvetica",
        "-apple-system",
        "BlinkMacSystemFont",
        "sans-serif",
      ],
    },
  },
  plugins: [],
};
