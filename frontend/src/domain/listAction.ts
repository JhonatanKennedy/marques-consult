import type { ItemDraft } from './list';

export type ListAction =
  | { kind: 'add'; draft: ItemDraft }
  | { kind: 'edit'; id: string; draft: ItemDraft }
  | { kind: 'remove'; id: string }
  | { kind: 'restore'; number: number }
  | { kind: 'move'; id: string; position: number };
