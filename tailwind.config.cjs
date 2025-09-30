/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#FF6B35", // Bold orange accent like in the reference
          secondary: "#1A1A1A", // Deep charcoal
          accent: "#FFB020", // Softer orange variant
          ink: "#0A0A0A", // Pure black for text
          paper: "#F8F8F8", // Soft white
          shadow: "#2A2A2A", // Dark shadow tone
          mist: "#E8E8E8" // Light mist for subtle elements
        },
        gray: {
          950: "#0A0A0A",
          900: "#1A1A1A",
          800: "#2A2A2A",
          700: "#3A3A3A",
          100: "#F0F0F0",
          50: "#F8F8F8"
        }
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"]
      },
      fontSize: {
        "hero": ["8rem", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "display": ["4rem", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "headline": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }]
      },
      borderRadius: {
        "none": "0",
        "sm": "0.125rem"
      },
      boxShadow: {
        "dramatic": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "soft": "0 4px 16px rgba(0, 0, 0, 0.1)",
        "minimal": "0 1px 3px rgba(0, 0, 0, 0.1)"
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "zoom": "zoom 1.2s ease-in-out infinite alternate",
        "flicker": "flicker 0.15s ease-in-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        zoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" }
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" }
        }
      }
    }
  },
  plugins: []
}
