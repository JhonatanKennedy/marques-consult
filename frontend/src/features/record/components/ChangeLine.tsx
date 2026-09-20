import type { ReactNode } from 'react';

type ChangeLineProps = {
  marker: '+' | '−' | '→';
  tone: string;
  children: ReactNode;
};

export function ChangeLine({ marker, tone, children }: ChangeLineProps) {
  return (
    <span className="flex gap-2">
      <span
        aria-hidden="true"
        className="shrink-0 font-mono"
        style={{ color: tone }}
      >
        {marker}
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </span>
  );
}
