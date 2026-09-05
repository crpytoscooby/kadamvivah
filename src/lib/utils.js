import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn - merge Tailwind class names conditionally.
 * Combines clsx (conditional classes) with tailwind-merge
 * (dedupes conflicting Tailwind utilities).
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
