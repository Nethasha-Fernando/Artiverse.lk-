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
        "sec-button-stroke": "#FFA8A6",
        "page-background": "#FBFBFB",
        "card-background": "#FCFCFC",
        "text-main-heading": "#272727",
        "text-sec-heading": "#3F3F3F",
        "text-body": "#484848",
        "text-sub-body": "#666666",
        "text-footnote": "#848484",
        "text-button": "#464646",
        icon: "#5A5A5A",
        border: "#CFCFCF",
      },
      fontFamily: {
        heading: ["Roboto", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 6px 18px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
