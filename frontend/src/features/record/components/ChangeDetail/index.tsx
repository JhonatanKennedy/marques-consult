import type { Change } from '@/domain/list';

const FIELD_LABEL: Record<string, string> = {
  name: 'nome',
  description: 'descrição',
};

function Line({
  marker,
  tone,
  children,
}: {
  marker: '+' | '−' | '→';
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <span className="flex gap-2">
      <span
        aria-hidden="true"
        className="shrink-0 font-mono"
        style={{ color: tone }}
      >
        {marker}
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </span>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <span className="label font-mono text-label text-ink-soft">{label}</span>
      <div className="grid gap-0.5 font-mono text-mono leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function ChangeDetail({ change }: { change: Change }) {
  switch (change.kind) {
    case 'created':
      return (
        <p className="font-mono text-mono leading-relaxed text-ink-soft">
          A lista foi criada, ainda sem itens. É a versão 1 e serve de ponto de
          partida para tudo o que veio depois.
        </p>
      );

    case 'added':
      return (
        <div className="grid gap-1 font-mono text-mono leading-relaxed">
          <Line marker="+" tone="var(--ink-added)">
            {change.item.name}
          </Line>
          {change.item.description && (
            <span className="pl-5 text-ink-soft">
              {change.item.description}
            </span>
          )}
        </div>
      );

    case 'removed':
      return (
        <div className="grid gap-1 font-mono text-mono leading-relaxed">
          <Line marker="−" tone="var(--ink-removed)">
            <span className="line-through decoration-2">
              {change.item.name}
            </span>
          </Line>
          {change.item.description && (
            <span className="pl-5 text-ink-soft line-through">
              {change.item.description}
            </span>
          )}
        </div>
      );

    case 'edited':
      return (
        <div className="grid gap-3">
          {change.fields.map((field) => (
            <Field key={field} label={FIELD_LABEL[field] ?? field}>
              <Line marker="−" tone="var(--ink-removed)">
                <span className="text-ink-soft line-through decoration-1">
                  {(field === 'name'
                    ? change.before.name
                    : change.before.description) || '— vazio —'}
                </span>
              </Line>
              <Line marker="+" tone="var(--ink-added)">
                {(field === 'name'
                  ? change.after.name
                  : change.after.description) || '— vazio —'}
              </Line>
            </Field>
          ))}
          {change.fields.includes('name') && (
            <p className="font-mono text-label leading-relaxed text-ink-soft">
              O item é o mesmo — só o texto mudou. A posição dele não foi
              tocada.
            </p>
          )}
        </div>
      );

    case 'moved':
      return (
        <div className="grid gap-2">
          <p className="font-mono text-mono leading-relaxed">
            <span style={{ color: 'var(--ink-moved)' }}>
              {change.item.name}
            </span>
          </p>
          <p className="flex flex-wrap items-center gap-2 font-mono text-mono">
            <span className="text-ink-soft">posição {change.from}</span>
            <span aria-hidden="true" style={{ color: 'var(--ink-moved)' }}>
              →
            </span>
            <span>posição {change.to}</span>
          </p>
          <p className="font-mono text-label leading-relaxed text-ink-soft">
            Foi um movimento, não {Math.abs(change.to - change.from)} edições.
          </p>
        </div>
      );

    case 'shifted':
      return (
        <p className="font-mono text-label leading-relaxed text-ink-soft">
          {change.item.name}: posição {change.from} → {change.to}
        </p>
      );
  }
}
