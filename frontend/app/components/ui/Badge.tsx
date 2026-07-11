import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        primary: 'bg-primary-100 text-primary-700',
        secondary: 'bg-secondary-100 text-secondary-700',
        gray: 'bg-gray-100 text-gray-700',
        purple: 'bg-purple-100 text-purple-700',
      },
    },
    defaultVariants: {
      variant: 'gray',
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, variant, className }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))}>{children}</span>;
}