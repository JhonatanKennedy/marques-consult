import type { ListRecord, ListVersion } from './list';
import type { ListAction } from './listAction';
import { appendVersion, truncateHistory } from './recordOrder';

export type Fold = (
  record: ListRecord | undefined,
  version: ListVersion,
) => ListRecord;

export const foldVersion: Fold = (record, version) => ({
  current: version,
  history: appendVersion(record?.history ?? [], version),
});

export const foldRollback: Fold = (record, version) => ({
  current: version,
  history: truncateHistory(record?.history ?? [], version),
});

export function foldFor(action: ListAction): Fold {
  switch (action.kind) {
    case 'restore':
      return foldRollback;
    case 'add':
    case 'edit':
    case 'remove':
    case 'move':
      return foldVersion;
  }
}
