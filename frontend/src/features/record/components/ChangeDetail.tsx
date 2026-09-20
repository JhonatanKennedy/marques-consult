import type { Change } from '@/domain/list';
import { ChangeLine } from '@/features/record/components/ChangeLine';
import { EditedChange } from '@/features/record/components/EditedChange';

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
          <ChangeLine marker="+" tone="var(--ink-added)">
            {change.item.name}
          </ChangeLine>
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
          <ChangeLine marker="−" tone="var(--ink-removed)">
            <span className="line-through decoration-2">
              {change.item.name}
            </span>
          </ChangeLine>
          {change.item.description && (
            <span className="pl-5 text-ink-soft line-through">
              {change.item.description}
            </span>
          )}
        </div>
      );

    case 'edited':
      return <EditedChange change={change} />;

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
