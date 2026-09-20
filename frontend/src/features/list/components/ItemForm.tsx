import { useEffect, useRef, useState } from 'react';
import { Input } from '@jhonatankennedy/ui-react';
import type { ItemDraft } from '@/domain/list';
import { ItemFormActions } from '@/features/list/components/ItemFormActions';
import { asLitRef } from '@/features/list/utils/litRef';

type Field = HTMLElement & { value?: string };

const valueOf = (element: Field | null) => element?.value ?? '';

type ItemFormProps = {
  initial?: ItemDraft;
  submitLabel: string;
  onSubmit: (draft: ItemDraft) => Promise<void> | void;
  onCancel?: () => void;
  autoFocus?: boolean;
};

export function ItemForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  autoFocus,
}: ItemFormProps) {
  const nameRef = useRef<Field | null>(null);
  const descriptionRef = useRef<Field | null>(null);
  const [isNameMissing, setIsNameMissing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (nameRef.current) nameRef.current.value = initial?.name ?? '';
    if (descriptionRef.current) {
      descriptionRef.current.value = initial?.description ?? '';
    }
  }, [initial?.name, initial?.description]);

  useEffect(() => {
    if (autoFocus) nameRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = async () => {
    const name = valueOf(nameRef.current).trim();
    if (!name) {
      setIsNameMissing(true);
      nameRef.current?.focus();
      return;
    }
    setIsNameMissing(false);
    setIsSaving(true);
    try {
      const description = valueOf(descriptionRef.current).trim();
      await onSubmit({ name, description: description || undefined });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="grid gap-3"
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          void handleSubmit();
        }
      }}
    >
      <Input
        ref={asLitRef(nameRef)}
        label="Nome"
        type="text"
        autocomplete="off"
        placeholder="O que entra na lista"
        error={isNameMissing ? 'O item precisa de um nome.' : undefined}
        helperText={isNameMissing ? undefined : 'Obrigatório'}
        onInput={() => setIsNameMissing(false)}
      />
      <Input
        ref={asLitRef(descriptionRef)}
        label="Descrição"
        type="text"
        autocomplete="off"
        placeholder="Opcional"
        helperText="Opcional"
      />
      <ItemFormActions
        submitLabel={submitLabel}
        isSaving={isSaving}
        onSubmit={() => void handleSubmit()}
        onCancel={onCancel}
      />
    </div>
  );
}
