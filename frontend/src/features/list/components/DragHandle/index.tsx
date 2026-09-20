import type { ComponentPropsWithoutRef, Ref } from 'react';
import { GripVertical } from 'lucide-react';
import './DragHandle.css';

export interface DragHandleProps extends ComponentPropsWithoutRef<'button'> {
  label: string;

  nodeRef?: Ref<HTMLButtonElement>;
}

export function DragHandle({
  label,
  nodeRef,
  className,
  ...rest
}: DragHandleProps) {
  return (
    <button
      type="button"
      ref={nodeRef}
      aria-label={label}
      className={`drag-handle rule grid size-7 shrink-0 place-items-center border-line bg-sheet text-ink-soft ${className ?? ''}`}
      {...rest}
    >
      <GripVertical size={14} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}
