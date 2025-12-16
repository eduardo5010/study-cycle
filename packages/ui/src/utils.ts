import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate color variants for components
export function getColorVariant(baseColor: string, variant: 'light' | 'dark' | 'default' = 'default') {
  const variants = {
    primary: {
      light: 'bg-primary-100 text-primary-800 border-primary-200',
      default: 'bg-primary-600 text-white border-primary-600',
      dark: 'bg-primary-800 text-white border-primary-800',
    },
    secondary: {
      light: 'bg-secondary-100 text-secondary-800 border-secondary-200',
      default: 'bg-secondary-600 text-white border-secondary-600',
      dark: 'bg-secondary-800 text-white border-secondary-800',
    },
    success: {
      light: 'bg-success-100 text-success-800 border-success-200',
      default: 'bg-success-600 text-white border-success-600',
      dark: 'bg-success-800 text-white border-success-800',
    },
    warning: {
      light: 'bg-warning-100 text-warning-800 border-warning-200',
      default: 'bg-warning-600 text-white border-warning-600',
      dark: 'bg-warning-800 text-white border-warning-800',
    },
    error: {
      light: 'bg-error-100 text-error-800 border-error-200',
      default: 'bg-error-600 text-white border-error-600',
      dark: 'bg-error-800 text-white border-error-800',
    },
  };

  return variants[baseColor as keyof typeof variants]?.[variant] || '';
}

// Generate size variants for components
export function getSizeVariant(size: 'sm' | 'md' | 'lg' | 'xl' = 'md') {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return sizes[size];
}

// Focus ring utility
export function focusRing(color: string = 'primary') {
  return `focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`;
}

// Disabled state utility
export function disabledState(disabled: boolean) {
  return disabled ? 'opacity-50 cursor-not-allowed' : '';
}

// Loading spinner utility
export function loadingSpinner(size: 'sm' | 'md' | 'lg' = 'md') {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return `animate-spin rounded-full border-2 border-current border-t-transparent ${sizes[size]}`;
}

// Button variant combinations
export function buttonVariants({
  variant = 'primary',
  size = 'md',
  disabled = false,
}: {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return cn(base, variants[variant], sizes[size], disabled && 'pointer-events-none');
}

// Input variant combinations
export function inputVariants({
  error = false,
  disabled = false,
}: {
  error?: boolean;
  disabled?: boolean;
} = {}) {
  const base = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500';

  if (error) {
    return cn(base, 'border-red-300 focus:border-red-500 focus:ring-red-500');
  }

  if (disabled) {
    return cn(base, 'bg-gray-50 text-gray-500 cursor-not-allowed');
  }

  return base;
}

// Card variants
export function cardVariants({
  variant = 'default',
  padding = 'md',
}: {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
} = {}) {
  const base = 'rounded-lg bg-white';

  const variants = {
    default: 'shadow-sm border border-gray-200',
    elevated: 'shadow-lg border border-gray-200',
    outlined: 'border-2 border-gray-200 shadow-none',
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return cn(base, variants[variant], paddings[padding]);
}

// Text variants
export function textVariants({
  size = 'base',
  weight = 'normal',
  color = 'default',
}: {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error';
} = {}) {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colors = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-600',
  };

  return cn(sizes[size], weights[weight], colors[color]);
}
