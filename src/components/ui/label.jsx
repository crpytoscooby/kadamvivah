import { cn } from '../../lib/utils';

/**
 * Label - shadcn-style form label.
 */
export const Label = ({ className, ...props }) => {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
};
