import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ItemDraft, ListRecord, ListVersion } from '@/domain/list';
import { reorderItems } from '@/domain/reorderTarget';
import {
  dimsSurface,
  inFlight,
  isMoving,
  isRemoving,
  isRestoring,
} from '@/domain/inFlight';
import type { ListAction } from '@/domain/listAction';
import { type Fold, foldFor } from '@/domain/listQuery';
import { LIST_QUERY_KEY } from '@/infrastructure/listQuery';
import { runAction } from '@/infrastructure/runAction';

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

  const run = async (action: ListAction): Promise<void> => {
    await mutateAsync(action).catch(() => {});
  };

  const add = (draft: ItemDraft) => run({ kind: 'add', draft });
  const edit = (id: string, draft: ItemDraft) =>
    run({ kind: 'edit', id, draft });
  const remove = (id: string) => run({ kind: 'remove', id });
  const move = (id: string, position: number) =>
    run({ kind: 'move', id, position });
  const restore = (number: number) => run({ kind: 'restore', number });

  const running = inFlight(isPending, variables);

  const removing = (itemId: string) => isRemoving(running, itemId);
  const restoring = (versionNumber: number) =>
    isRestoring(running, versionNumber);
  const moving = (itemId: string) => isMoving(running, itemId);

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
