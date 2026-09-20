import type { ItemDraft, ListVersion } from '@/domain/list';
import { request } from './http';

export const api = {
  current: (signal?: AbortSignal) => request<ListVersion>('/list', { signal }),

  history: (signal?: AbortSignal) =>
    request<ListVersion[]>('/list/history', { signal }),

  addItem: (draft: ItemDraft) =>
    request<ListVersion>('/list/items', {
      method: 'POST',
      body: JSON.stringify(draft),
    }),

  editItem: (id: string, draft: ItemDraft) =>
    request<ListVersion>(`/list/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(draft),
    }),

  removeItem: (id: string) =>
    request<ListVersion>(`/list/items/${id}`, { method: 'DELETE' }),

  reorderItem: (id: string, newOrder: number) =>
    request<ListVersion>(`/list/items/${id}/reorder`, {
      method: 'PATCH',
      body: JSON.stringify({ newOrder }),
    }),

  restore: (number: number) =>
    request<ListVersion>(`/list/restore/${number}`, { method: 'POST' }),
};
