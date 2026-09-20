import type { ListVersion } from '@/domain/list';
import { api as listApi } from './list-api';
import type { ListAction } from '@/domain/list-action';

export function runAction(action: ListAction): Promise<ListVersion> {
  switch (action.kind) {
    case 'add':
      return listApi.addItem(action.draft);
    case 'edit':
      return listApi.editItem(action.id, action.draft);
    case 'remove':
      return listApi.removeItem(action.id);
    case 'restore':
      return listApi.restore(action.number);
    case 'move':
      return listApi.reorderItem(action.id, action.position);
  }
}
