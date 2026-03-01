import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        // ✅ Explicit brand colors for light mode
        brand: {
          primary: '#0A2463',    // Deep blue (ASilva primary)
          secondary: '#0D3B66',  // Navy blue
          accent: '#00B4D8',     // Cyan accent
          light: '#F8F9FA',      // Light gray background
          dark: '#1A1A1A',       // Near-black text
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'], // ✅ Added serif font stack
      },
      borderRadius: {
        lg: 'calc(var(--radius) + 2px)',
        md: 'var(--radius)',
        sm: 'calc(var(--radius) - 2px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      // ✅ ENHANCED TYPOGRAPHY: Explicit black/dark gray text on white backgrounds
      typography: {
        DEFAULT: {
          css: {
            // Base text styling for maximum readability
            color: 'hsl(var(--foreground))', // Fallback to CSS variable
            '@apply text-gray-800 dark:text-gray-200': {}, // ✅ Explicit light/dark mode colors
            
            maxWidth: '65ch',
            lineHeight: '1.75',
            
            // Headings with proper hierarchy
            h1: {
              '@apply text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white': {},
              lineHeight: '1.2',
            },
            h2: {
              '@apply text-2xl font-bold mt-10 mb-3 text-gray-900 dark:text-white border-l-4 border-brand-primary pl-3': {},
              lineHeight: '1.3',
            },
            h3: {
              '@apply text-xl font-semibold mt-8 mb-2 text-gray-900 dark:text-white': {},
              lineHeight: '1.4',
            },
            h4: {
              '@apply text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-white': {},
            },
            
            // Paragraphs and inline elements
            p: {
              '@apply my-4 text-gray-800 dark:text-gray-300': {},
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            a: {
              '@apply text-brand-primary font-medium hover:text-brand-secondary transition-colors underline-offset-2 hover:underline': {},
            },
            strong: {
              '@apply font-semibold text-gray-900 dark:text-white': {},
            },
            em: {
              '@apply not-italic text-gray-700 dark:text-gray-300 font-medium': {},
            },
            code: {
              '@apply px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-mono text-brand-primary dark:text-brand-accent': {},
            },
            pre: {
              '@apply p-4 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-x-auto my-6': {},
              code: {
                '@apply bg-transparent p-0 text-sm': {},
              },
            },
            
            // Lists
            'ul, ol': {
              '@apply my-6 pl-6': {},
              li: {
                '@apply my-1 text-gray-800 dark:text-gray-300': {},
                'p:first-child': { marginTop: 0 },
                'p:last-child': { marginBottom: 0 },
              },
            },
            'ul > li::before': {
              backgroundColor: '#0A2463',
            },
            'ol > li::before': {
              color: '#0A2463',
            },
            
            // Blockquotes
            blockquote: {
              '@apply border-l-4 border-brand-accent pl-4 italic my-6 py-2 bg-gray-50 dark:bg-gray-800/50': {},
              color: '#1A1A1A',
              p: {
                '@apply text-lg font-medium text-gray-900 dark:text-gray-100': {},
              },
            },
            
            // Tables
            table: {
              '@apply w-full my-8 text-sm': {},
              thead: {
                '@apply bg-gray-50 dark:bg-gray-800/50': {},
                th: {
                  '@apply py-2 px-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700': {},
                },
              },
              tbody: {
                tr: {
                  '@apply border-b border-gray-100 dark:border-gray-800': {},
                  td: {
                    '@apply py-2 px-3 text-gray-800 dark:text-gray-300': {},
                  },
                  '&:last-child': {
                    borderColor: 'transparent',
                  },
                },
              },
            },
            
            // Horizontal rules
            hr: {
              '@apply my-10 border-t border-gray-200 dark:border-gray-700': {},
            },
            
            // Images
            img: {
              '@apply rounded-lg my-6': {},
            },
            
            // Responsive adjustments
            '@screen sm': {
              maxWidth: '70ch',
            },
            '@screen md': {
              maxWidth: '75ch',
            },
          },
        },
        // ✅ Light mode override (explicit white background + dark text)
        light: {
          css: {
            '--tw-prose-body': '#1A1A1A',        // Near-black body text
            '--tw-prose-headings': '#0A2463',    // Brand blue headings
            '--tw-prose-links': '#0A2463',       // Brand blue links
            '--tw-prose-bold': '#0A2463',        // Bold text in brand blue
            '--tw-prose-counters': '#6B7280',    // Gray counters
            '--tw-prose-bullets': '#0A2463',     // Blue bullet points
            '--tw-prose-hr': '#E5E7EB',          // Light gray HR
            '--tw-prose-quotes': '#0A2463',      // Blue quotes
            '--tw-prose-quote-borders': '#0A2463',
            '--tw-prose-captions': '#6B7280',    // Gray captions
            '--tw-prose-code': '#0A2463',        // Blue code
            '--tw-prose-pre-code': '#1A1A1A',    // Dark code text
            '--tw-prose-pre-bg': '#F9FAFB',      // Light code background
            '--tw-prose-th-borders': '#D1D5DB',  // Table borders
            '--tw-prose-td-borders': '#E5E7EB',  // Table cell borders
            
            color: '#1A1A1A',                    // ✅ Explicit near-black text
            backgroundColor: '#FFFFFF',          // ✅ Explicit white background
            '[class~="lead"]': { color: '#4B5563' },
          }
        },
      },
    }
  },
  plugins: [
    animate,
    typography,
  ],
} satisfies Config;