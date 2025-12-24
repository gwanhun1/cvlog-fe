import { HTMLAttributes } from 'react';
import { cn } from 'styles/utils';

export const Typography = {
  Title: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn('tracking-[-0.01em]', className)} {...props} />
  ),
  Text: ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
    <span className={cn('tracking-[-0.01em]', className)} {...props} />
  ),
};
