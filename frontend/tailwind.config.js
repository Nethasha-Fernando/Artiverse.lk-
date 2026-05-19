/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF5C5C",
        secondary: "#C41A1A",
        accent: "#FFDDDC",
        secButtonStroke: "#FFA8A6",
        pageBackground: "#FBFBFB",
        cardBackground: "#FCFCFC",
        textMainHeading: "#272727",
        textSecHeading: "#3F3F3F",
        textBody: "#484848",
        textSubBody: "#666666",
        textFootnote: "#848484",
        textButton: "#464646",
        icon: "#5A5A5A",
        border:"#CFCFCF"
      },
      fontFamily: {
        heading: ["Roboto", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
