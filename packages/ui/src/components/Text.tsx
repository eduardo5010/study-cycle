import React from 'react';
import { cn, textVariants } from '../utils';

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error';
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, size = 'base', weight = 'normal', color = 'default', as: Component = 'span', ...props }, ref) => {
    return (
      <Component
        className={cn(textVariants({ size, weight, color }), className)}
        ref={ref as any}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';
