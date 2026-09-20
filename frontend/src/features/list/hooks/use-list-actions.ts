import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { ItemDraft, ListRecord, ListVersion } from '@/domain/list';
import { reorderItems } from '@/domain/reorder-target';
import {
  dimsSurface,
  inFlight,
  isMoving,
  isRemoving,
  isRestoring,
} from '@/domain/in-flight';
import type { ListAction } from '@/domain/list-action';
import { type Fold, foldFor } from '@/domain/list-query';
import { LIST_QUERY_KEY } from '@/infrastructure/list-query';
import { runAction } from '@/infrastructure/run-action';

export interface ListActions {
  isBusy: boolean;
  dims: boolean;
  isRemoving: (itemId: string) => boolean;
  isRestoring: (versionNumber: number) => boolean;
  isMoving: (itemId: string) => boolean;
  error: unknown;
  add: (draft: ItemDraft) => Promise<void>;
  edit: (id: string, draft: ItemDraft) => Promise<void>;
  remove: (id: string) => Promise<void>;
  move: (id: string, position: number) => Promise<void>;
  restore: (number: number) => Promise<void>;
  dismiss: () => void;
}

export interface ListActionsOptions {
  writeWith: (fold: Fold, version: ListVersion) => void;
}

interface MoveSnapshot {
  previous: ListRecord | undefined;
}

export function useListActions({ writeWith }: ListActionsOptions): ListActions {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (action: ListAction) => runAction(action),
    onMutate: async (action: ListAction): Promise<MoveSnapshot | undefined> => {
      if (action.kind !== 'move') return undefined;

      await queryClient.cancelQueries({ queryKey: LIST_QUERY_KEY });
      const previous = queryClient.getQueryData<ListRecord>(LIST_QUERY_KEY);
      if (!previous) return { previous };

      queryClient.setQueryData<ListRecord>(LIST_QUERY_KEY, {
        current: {
          ...previous.current,
          items: reorderItems(
            previous.current.items,
            action.id,
            action.position,
          ),
        },
        history: previous.history,
      });

      return { previous };
    },
    onError: (_error, _action, context) => {
      if (context?.previous) {
        queryClient.setQueryData(LIST_QUERY_KEY, context.previous);
      }
    },
    onSuccess: (version, action) => {
      writeWith(foldFor(action), version);
    },
  });

  const { mutateAsync, error, reset, isPending, variables } = mutation;

  const run = useCallback(
    async (action: ListAction): Promise<void> => {
      await mutateAsync(action).catch(() => {});
    },
    [mutateAsync],
  );

  const add = useCallback(
    (draft: ItemDraft) => run({ kind: 'add', draft }),
    [run],
  );

  const edit = useCallback(
    (id: string, draft: ItemDraft) => run({ kind: 'edit', id, draft }),
    [run],
  );

  const remove = useCallback(
    (id: string) => run({ kind: 'remove', id }),
    [run],
  );

  const move = useCallback(
    (id: string, position: number) => run({ kind: 'move', id, position }),
    [run],
  );

  const restore = useCallback(
    (number: number) => run({ kind: 'restore', number }),
    [run],
  );

  const running = inFlight(isPending, variables);

  const removing = useCallback(
    (itemId: string) => isRemoving(running, itemId),
    [running],
  );
  const restoring = useCallback(
    (versionNumber: number) => isRestoring(running, versionNumber),
    [running],
  );
  const moving = useCallback(
    (itemId: string) => isMoving(running, itemId),
    [running],
  );

  return {
    isBusy: running !== null,
    dims: dimsSurface(running),
    isRemoving: removing,
    isRestoring: restoring,
    isMoving: moving,
    error,
    add,
    edit,
    remove,
    move,
    restore,
    dismiss: reset,
  };
}
