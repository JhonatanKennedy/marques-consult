import type { ItemDraft } from '@/domain/list';
import { ItemForm } from '@/features/list/components/ItemForm';

type AddPanelProps = {
  dimmed: string;
  onSubmit: (draft: ItemDraft) => Promise<void>;
  onCancel: () => void;
};

export function AddPanel({ dimmed, onSubmit, onCancel }: AddPanelProps) {
  return (
    <div className={`settle-in rule mb-4 border-line bg-sheet p-4 ${dimmed}`}>
      <ItemForm
        submitLabel="Adicionar à lista"
        autoFocus
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
