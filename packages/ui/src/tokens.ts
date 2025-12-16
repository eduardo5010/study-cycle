// Design tokens for StudyCycle

// Colors
export const colors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Secondary colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  // Success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  // Warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Error colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
} as const;

// Typography
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
} as const;

// Spacing
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
} as const;

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Animation
export const animation = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  easing: {
    linear: 'linear',
    in: 'ease-in',
    out: 'ease-out',
    'in-out': 'ease-in-out',
  },
} as const;

// Z-index
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
} as const;

// StudyCycle specific tokens
export const studyCycle = {
  colors: {
    brand: colors.primary[600],
    accent: colors.secondary[600],
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
    background: colors.neutral[50],
    surface: '#ffffff',
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
  },
  spacing: {
    card: spacing[6],
    section: spacing[12],
    page: spacing[16],
  },
  borderRadius: {
    card: borderRadius.lg,
    button: borderRadius.md,
    input: borderRadius.md,
  },
} as const;

// Responsive sizing helpers for both web and mobile
export const responsive = {
  // Mobile-first breakpoints (in pixels)
  breakpoints: {
    xs: 320, // Extra small phones
    sm: 640, // Small phones
    md: 768, // Tablets
    lg: 1024, // Desktops
    xl: 1280, // Large desktops
    '2xl': 1536, // Extra large
  },

  // Font sizes that scale with breakpoints
  fontSize: {
    h1: {
      xs: 24,
      sm: 28,
      md: 32,
      lg: 48,
    },
    h2: {
      xs: 20,
      sm: 24,
      md: 28,
      lg: 36,
    },
    h3: {
      xs: 18,
      sm: 20,
      md: 24,
      lg: 28,
    },
    h4: {
      xs: 16,
      sm: 18,
      md: 20,
      lg: 24,
    },
    body: {
      xs: 14,
      sm: 14,
      md: 16,
      lg: 16,
    },
    caption: {
      xs: 12,
      sm: 12,
      md: 14,
      lg: 14,
    },
  },

  // Spacing that scales with breakpoints
  spacing: {
    xs: {
      xs: 8,
      sm: 8,
      md: 12,
      lg: 16,
    },
    sm: {
      xs: 12,
      sm: 12,
      md: 16,
      lg: 24,
    },
    md: {
      xs: 16,
      sm: 16,
      md: 24,
      lg: 32,
    },
    lg: {
      xs: 24,
      sm: 24,
      md: 32,
      lg: 48,
    },
    xl: {
      xs: 32,
      sm: 32,
      md: 48,
      lg: 64,
    },
  },
} as const;
