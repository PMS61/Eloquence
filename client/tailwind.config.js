/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
       
        primary: "#3ABDF8",
        secondary: "#818CF8",
        accent: "#0F172A",
        neutral: "#1E293B",
       
          lighttext : "#FFFCFC",
          darktext : "#000000",
      },
    },
  },
  plugins: [],
};
