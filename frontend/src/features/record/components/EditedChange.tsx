import type { Change } from '@/domain/list';
import { ChangeLine } from '@/features/record/components/ChangeLine';

const FIELD_LABEL: Record<string, string> = {
  name: 'nome',
  description: 'descrição',
};

type EditedChangeProps = {
  change: Extract<Change, { kind: 'edited' }>;
};

export function EditedChange({ change }: EditedChangeProps) {
  return (
    <div className="grid gap-3">
      {change.fields.map((field) => (
        <div key={field} className="grid gap-1">
          <span className="label font-mono text-label text-ink-soft">
            {FIELD_LABEL[field] ?? field}
          </span>
          <div className="grid gap-0.5 font-mono text-mono leading-relaxed">
            <ChangeLine marker="−" tone="var(--ink-removed)">
              <span className="text-ink-soft line-through decoration-1">
                {(field === 'name'
                  ? change.before.name
                  : change.before.description) || '— vazio —'}
              </span>
            </ChangeLine>
            <ChangeLine marker="+" tone="var(--ink-added)">
              {(field === 'name'
                ? change.after.name
                : change.after.description) || '— vazio —'}
            </ChangeLine>
          </div>
        </div>
      ))}

      {change.fields.includes('name') && (
        <p className="font-mono text-label leading-relaxed text-ink-soft">
          O item é o mesmo — só o texto mudou. A posição dele não foi tocada.
        </p>
      )}
    </div>
  );
}
