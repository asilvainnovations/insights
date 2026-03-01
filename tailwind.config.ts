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
        brand: {
          primary: '#0A2463',
          secondary: '#0D3B66',
          accent: '#00B4D8',
          light: '#F8F9FA',
          dark: '#1A1A1A',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
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
      typography: {
        DEFAULT: {
          css: {
            color: 'hsl(var(--foreground))',
            maxWidth: '65ch',
            lineHeight: '1.75',
            h1: {
              fontSize: '2.25rem',
              fontWeight: '700',
              marginTop: '2rem',
              marginBottom: '1rem',
              lineHeight: '1.2',
              color: '#111827',
            },
            h2: {
              fontSize: '1.5rem',
              fontWeight: '700',
              marginTop: '2.5rem',
              marginBottom: '0.75rem',
              lineHeight: '1.3',
              color: '#111827',
              borderLeftWidth: '4px',
              borderLeftColor: '#0A2463',
              paddingLeft: '0.75rem',
            },
            h3: {
              fontSize: '1.25rem',
              fontWeight: '600',
              marginTop: '2rem',
              marginBottom: '0.5rem',
              lineHeight: '1.4',
              color: '#111827',
            },
            h4: {
              fontSize: '1.125rem',
              fontWeight: '600',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
              color: '#111827',
            },
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              color: '#1f2937',
            },
            a: {
              color: '#0A2463',
              fontWeight: '500',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              transition: 'color 0.2s',
            },
            'a:hover': {
              color: '#0D3B66',
            },
            strong: {
              fontWeight: '600',
              color: '#111827',
            },
            em: {
              fontStyle: 'italic',
              color: '#374151',
            },
            code: {
              padding: '0.25rem 0.5rem',
              borderRadius: '0.375rem',
              backgroundColor: '#f3f4f6',
              fontSize: '0.875rem',
              fontFamily: 'JetBrains Mono, monospace',
              color: '#0A2463',
            },
            pre: {
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb',
              overflowX: 'auto',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              fontSize: '0.875rem',
              color: '#1f2937',
            },
            'ul, ol': {
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              paddingLeft: '1.5rem',
            },
            li: {
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              color: '#1f2937',
            },
            'ul > li::marker': {
              color: '#0A2463',
            },
            'ol > li::marker': {
              color: '#0A2463',
            },
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: '#00B4D8',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: 'rgba(0, 180, 216, 0.05)',
              borderRadius: '0 0.5rem 0.5rem 0',
            },
            'blockquote p': {
              fontSize: '1.125rem',
              fontWeight: '500',
              color: '#111827',
              margin: '0',
            },
            table: {
              width: '100%',
              marginTop: '2rem',
              marginBottom: '2rem',
              fontSize: '0.875rem',
            },
            thead: {
              backgroundColor: '#f9fafb',
            },
            'thead th': {
              padding: '0.75rem',
              textAlign: 'left',
              fontWeight: '600',
              color: '#111827',
              borderBottomWidth: '1px',
              borderBottomColor: '#e5e7eb',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: '#f3f4f6',
            },
            'tbody td': {
              padding: '0.75rem',
              color: '#1f2937',
            },
            hr: {
              marginTop: '2.5rem',
              marginBottom: '2.5rem',
              borderTopWidth: '1px',
              borderColor: '#e5e7eb',
            },
            img: {
              borderRadius: '0.5rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
          },
        },
        light: {
          css: {
            '--tw-prose-body': '#1A1A1A',
            '--tw-prose-headings': '#0A2463',
            '--tw-prose-links': '#0A2463',
            '--tw-prose-bold': '#0A2463',
            '--tw-prose-counters': '#6B7280',
            '--tw-prose-bullets': '#0A2463',
            '--tw-prose-hr': '#E5E7EB',
            '--tw-prose-quotes': '#0A2463',
            '--tw-prose-quote-borders': '#0A2463',
            '--tw-prose-captions': '#6B7280',
            '--tw-prose-code': '#0A2463',
            '--tw-prose-pre-code': '#1A1A1A',
            '--tw-prose-pre-bg': '#F9FAFB',
            '--tw-prose-th-borders': '#D1D5DB',
            '--tw-prose-td-borders': '#E5E7EB',
            color: '#1A1A1A',
            backgroundColor: '#FFFFFF',
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
