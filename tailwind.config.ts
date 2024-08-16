import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        github: {
          dark: {
            background: '#0d1117',
            text: '#c9d1d9',
            primary: '#58a6ff',
            secondary: '#8b949e',
            tertiary: '#161b22',
            info: '#1f6feb',
            success: '#2ea043',
            warning: '#d29922',
            error: '#f85149',
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [],
  darkMode: "media",
};

export default config;
