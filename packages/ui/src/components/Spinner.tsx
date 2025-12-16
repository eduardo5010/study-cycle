import React from 'react';
import { cn, loadingSpinner } from '../utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        className={cn(loadingSpinner(size), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';
