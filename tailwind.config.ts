import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      animation: {
        swing: "swing 0.6s ease-in-out infinite"
      },
      keyframes: {
        swing: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(4px)" },
          "100%": { transform: "translateX(0)" }
        }
      }
    }
  }
};

export default config;
