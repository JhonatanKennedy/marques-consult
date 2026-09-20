export interface ListItem {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export function byOrder(items: ListItem[]): ListItem[] {
  return [...items].sort((left, right) => left.order - right.order);
}

export interface ItemDraft {
  name: string;
  description?: string;
}

export interface ListVersion {
  listId: number;
  number: number;
  items: ListItem[];
  id?: number;
  createdAt?: string;
}

export interface ListRecord {
  current: ListVersion;
  history: ListVersion[];
}

export type ChangedField = 'name' | 'description';

export type Change =
  | { kind: 'created' }
  | { kind: 'added'; item: ListItem }
  | { kind: 'removed'; item: ListItem }
  | {
      kind: 'edited';
      before: ListItem;
      after: ListItem;
      fields: ChangedField[];
    }
  | { kind: 'moved'; item: ListItem; from: number; to: number }
  | { kind: 'shifted'; item: ListItem; from: number; to: number };
