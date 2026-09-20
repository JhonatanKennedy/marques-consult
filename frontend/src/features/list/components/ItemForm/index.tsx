import { useEffect, useRef, useState } from 'react';
import { Button, Input } from '@jhonatankennedy/ui-react';
import type { ItemDraft } from '@/domain/list';
import { asLitRef } from '@/features/list/lit-ref';

type Field = HTMLElement & { value?: string };

const valueOf = (element: Field | null) => element?.value ?? '';

interface Props {
  initial?: ItemDraft;
  submitLabel: string;
  onSubmit: (draft: ItemDraft) => Promise<void> | void;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export function ItemForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  autoFocus,
}: Props) {
  const nameRef = useRef<Field | null>(null);
  const descriptionRef = useRef<Field | null>(null);
  const [missingName, setMissingName] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (nameRef.current) nameRef.current.value = initial?.name ?? '';
    if (descriptionRef.current) {
      descriptionRef.current.value = initial?.description ?? '';
    }
  }, [initial?.name, initial?.description]);

  useEffect(() => {
    if (autoFocus) nameRef.current?.focus();
  }, [autoFocus]);

  const submit = async () => {
    const name = valueOf(nameRef.current).trim();
    if (!name) {
      setMissingName(true);
      nameRef.current?.focus();
      return;
    }
    setMissingName(false);
    setSaving(true);
    try {
      const description = valueOf(descriptionRef.current).trim();
      await onSubmit({ name, description: description || undefined });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="grid gap-3"
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          void submit();
        }
      }}
    >
      <Input
        ref={asLitRef(nameRef)}
        label="Nome"
        type="text"
        autocomplete="off"
        placeholder="O que entra na lista"
        error={missingName ? 'O item precisa de um nome.' : undefined}
        helperText={missingName ? undefined : 'Obrigatório'}
        onInput={() => setMissingName(false)}
      />
      <Input
        ref={asLitRef(descriptionRef)}
        label="Descrição"
        type="text"
        autocomplete="off"
        placeholder="Opcional"
        helperText="Opcional"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" size="md" disabled={saving} onClick={submit}>
          {saving ? 'Gravando…' : submitLabel}
        </Button>
        {onCancel && (
          <Button
            variant="ghost"
            size="md"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
        )}
        <span className="ml-auto font-mono text-label text-ink-soft">
          Toda mudança vira uma versão
        </span>
      </div>
    </div>
  );
}
