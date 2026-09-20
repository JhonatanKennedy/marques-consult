import type { ListRecord } from '@/domain/list';
import { api as listApi } from './listApi';

export const LIST_QUERY_KEY = ['list'] as const;

export type Status = 'loading' | 'ready' | 'error';

export async function loadRecord(signal?: AbortSignal): Promise<ListRecord> {
  const current = await listApi.current(signal);
  const history = await listApi.history(signal);

  return { current, history: [...history].reverse() };
}
