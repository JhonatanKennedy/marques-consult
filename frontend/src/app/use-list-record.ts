import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { ListRecord, ListVersion } from '@/domain/list';
import type { Fold } from '@/domain/list-query';
import {
  LIST_QUERY_KEY,
  type Status,
  loadRecord,
} from '@/infrastructure/list-query';

export interface ListRecordState {
  record: ListRecord | undefined;
  status: Status;
  error: unknown;
  writeWith: (fold: Fold, version: ListVersion) => void;
  reload: () => Promise<void>;
}

export function useListRecord(): ListRecordState {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: LIST_QUERY_KEY,
    queryFn: ({ signal }) => loadRecord(signal),
  });

  let status: Status = 'ready';
  if (query.isPending) status = 'loading';
  if (query.isError) status = 'error';

  const writeWith = useCallback(
    (fold: Fold, version: ListVersion) => {
      queryClient.setQueryData<ListRecord>(LIST_QUERY_KEY, (previous) =>
        fold(previous, version),
      );
    },
    [queryClient],
  );

  const reload = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    record: query.data,
    status,
    error: query.error,
    writeWith,
    reload,
  };
}
