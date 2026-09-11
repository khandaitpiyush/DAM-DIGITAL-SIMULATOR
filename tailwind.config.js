/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#0B0F17',
          panel: '#0F172A',
          card: '#131D2F',
          cardHover: '#1A263D',
          border: '#1E293B',
          borderSubtle: '#26354D',
          textMuted: '#64748B',
          textDim: '#94A3B8',
          textBright: '#F8FAFC',
        },
        hydro: {
          cyan: '#06B6D4',
          sky: '#0284C7',
          blue: '#2563EB',
          glow: 'rgba(6, 182, 212, 0.15)',
        },
        status: {
          safe: '#10B981',
          safeGlow: 'rgba(16, 185, 129, 0.15)',
          warning: '#F59E0B',
          warningGlow: 'rgba(245, 158, 11, 0.15)',
          critical: '#EF4444',
          criticalGlow: 'rgba(239, 68, 68, 0.2)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
