import { useCallback, useState } from 'react';
import { byOrder, type ItemDraft, type ListVersion } from '@/domain/list';
import { useListActions } from '@/features/list';
import { type Status } from '@/infrastructure/listQuery';
import { useListRecord } from './useListRecord';

export interface ListController {
  current: ListVersion | null;
  history: ListVersion[];
  items: ListVersion['items'];
  status: Status;
  error: unknown;
  isBusy: boolean;
  dims: boolean;
  isRemoving: (itemId: string) => boolean;
  isRestoring: (versionNumber: number) => boolean;
  isMoving: (itemId: string) => boolean;
  add: (draft: ItemDraft) => Promise<void>;
  edit: (id: string, draft: ItemDraft) => Promise<void>;
  remove: (id: string) => Promise<void>;
  move: (id: string, position: number) => Promise<void>;
  restore: (number: number) => Promise<void>;
  reload: () => Promise<void>;
  dismissError: () => void;
}

export function useList(): ListController {
  const record = useListRecord();

  const { writeWith, reload: reloadRecord } = record;

  const actions = useListActions({ writeWith });

  const { dismiss } = actions;

  const [dismissed, setDismissed] = useState<unknown>(null);

  const rawError = actions.error ?? record.error;
  const error = rawError === dismissed ? null : rawError;

  const dismissError = useCallback(() => {
    setDismissed(rawError);

    dismiss();
  }, [rawError, dismiss]);

  const reload = useCallback(async () => {
    dismiss();
    await reloadRecord();
  }, [dismiss, reloadRecord]);

  const current = record.record?.current ?? null;

  return {
    current,
    history: record.record?.history ?? [],
    items: current ? byOrder(current.items) : [],
    status: record.status,
    error,
    isBusy: actions.isBusy,
    dims: actions.dims,
    isRemoving: actions.isRemoving,
    isRestoring: actions.isRestoring,
    isMoving: actions.isMoving,
    add: actions.add,
    edit: actions.edit,
    remove: actions.remove,
    move: actions.move,
    restore: actions.restore,
    reload,
    dismissError,
  };
}
