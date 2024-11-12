/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        plain: {
          DEFAULT: "#FFFFFF",
          dark: "#000000",
        },
        primary: "#007AFF",
        accent: {
          cyan: "#5AC8FA",
          gold: "#F1AA05",
          purple: "#AF51DE",
          green: "#35C759",
        },
        separator: "rgba(60, 60, 67, 0.36)",
        icon: "#959595",
        label: {
          secondary: "#8E8E93",
          tabbar: "rgba(84, 84, 88, 0.65)",
          date: "#6D6D71",
        },
        bg: {
          secondary: "#EFEFF3",
          notification: "rgba(45, 45, 45, 0.80)",
          tabbar: {
            DEFAULT: "rgba(241, 241, 242, 0.75)",
            dark: "rgba(219, 219, 219, 0.75)",
          },
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(120%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-down": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(120%)" },
        },
        "fade-out-down": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
        },
        "blur-in": {
          "0%, 30%": { opacity: "0", filter: "blur(10px)" },
          "100%": { opacity: "1", filter: "blur(0px)" },
        },
        "blur-in-initial": {
          "0%, 60%": { opacity: "0", filter: "blur(10px)" },
          "100%": { opacity: "1", filter: "blur(0px)" },
        },
        "page-in": {
          "0%": { opacity: "0", filter: "blur(5px)", scale: "0.95" },
          "100%": { opacity: "1", filter: "blur(0px)", scale: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-up": "slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-in-up": "fade-in-up 0.4s ease-out forwards",
        "fade-out": "fade-out 0.4s ease-out",
        "slide-down": "slide-down 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-out-down": "fade-out-down 0.4s ease-out forwards",
        "in-lottie": "blur-in 0.55s ease-out forwards",
        "in-lottie-initial": "blur-in-initial 1s ease-out forwards",
        "in-card": "fade-in 0.35s ease-out forwards",
        "in-page": "page-in 0.25s ease-out forwards",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
