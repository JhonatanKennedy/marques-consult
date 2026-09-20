import { Card } from '@jhonatankennedy/ui-react';
import type { ItemDraft, ListItem } from '@/domain/list';
import { ItemForm } from '@/features/list/components/ItemForm';

export interface ItemEditCardProps {
  item: ListItem;
  onSubmit: (draft: ItemDraft) => Promise<void>;
  onCancel: () => void;
}

export function ItemEditCard({ item, onSubmit, onCancel }: ItemEditCardProps) {
  return (
    <Card accent="var(--ds-primary)">
      <ItemForm
        initial={{ name: item.name, description: item.description }}
        submitLabel="Salvar mudança"
        autoFocus
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </Card>
  );
}
