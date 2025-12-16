import React from 'react';
import { cn, cardVariants } from '../utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, padding }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
