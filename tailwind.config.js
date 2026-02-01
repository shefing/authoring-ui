import {
    isolateInsideOfContainer,
    scopedPreflightStyles,
} from 'tailwindcss-scoped-preflight'

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class", "data-theme", '[data-theme="dark"]'],
    content: [

        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app//*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
        './node_modules/@shefing/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                info: {
                    DEFAULT: "var(--info)",
                    foreground: "var(--info-foreground)",
                },
                success: {
                    DEFAULT: "var(--success)",
                    foreground: "var(--success-foreground)",
                },
                warning: {
                    DEFAULT: "var(--warning)",
                    foreground: "var(--warning-foreground)",
                },
            },
            spacing: {
                xs: '4px',
                sm: '8px',
                md: '16px',
                lg: '24px',
                xl: '32px',
                '2xl': '48px',
                '3xl': '64px',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
                xl: "var(--radius-xl)",
            },
            fontWeight: {
                normal: "var(--font-weight-normal)",
                medium: "var(--font-weight-medium)",
                heavy: "var(--font-weight-heavy)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [
        scopedPreflightStyles({
            isolationStrategy: isolateInsideOfContainer(['.useTw', '[data-radix-popper-content-wrapper]']),
        }),
    ],
}