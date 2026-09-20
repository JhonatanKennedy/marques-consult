import type { RefObject } from 'react';

export function asLitRef<T extends HTMLElement>(
  ref: RefObject<T | null>,
): RefObject<never> {
  return ref as RefObject<never>;
}
