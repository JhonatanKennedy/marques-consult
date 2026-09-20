import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Change, ListVersion } from '@/domain/list';
import { primaryChanges } from '@/domain/deriveChanges';
import type { VersionRowState } from '@/features/record/utils/versionRowState';
import { timeOf } from '@/text/dates';
import { plural } from '@/text/plural';
import { headline } from '@/text/record';

const KIND: Record<Change['kind'], { label: string; ink: string }> = {
  created: { label: 'início', ink: 'var(--ink-restored)' },
  added: { label: 'adicionou', ink: 'var(--ink-added)' },
  removed: { label: 'removeu', ink: 'var(--ink-removed)' },
  edited: { label: 'editou', ink: 'var(--ink-edited)' },
  moved: { label: 'moveu', ink: 'var(--ink-moved)' },
  shifted: { label: 'deslocou', ink: 'var(--ink-moved)' },
};

type VersionRowHeaderProps = {
  version: ListVersion;
  changes: Change[];
  state: VersionRowState;
  onToggle: () => void;
};

export function VersionRowHeader({
  version,
  changes,
  state,
  onToggle,
}: VersionRowHeaderProps) {
  const isOpen = state.isOpen;
  const isCurrent = state.kind === 'current';
  const primary = primaryChanges(changes);
  const lead = primary[0];
  const rest = primary.slice(1);
  const kind = KIND[lead?.kind ?? 'created'];

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className="flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-white/5"
    >
      <span className="mt-0.5 shrink-0 text-ink-soft" aria-hidden="true">
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </span>

      <span className="grid min-w-0 flex-1 gap-1">
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-mono text-label font-bold tabular-nums text-record-ink">
            #{version.number}
          </span>
          <span className="font-mono text-label tabular-nums text-ink-soft">
            {timeOf(version.createdAt)}
          </span>
          <span
            className="label font-mono text-label"
            style={{ color: kind.ink }}
          >
            {kind.label}
          </span>
          {isCurrent && (
            <span className="label font-mono text-label text-ink-soft">
              · atual
            </span>
          )}
        </span>

        <span className="font-body text-body leading-snug text-record-ink">
          {lead ? headline(lead) : 'sem mudanças registradas'}
          {rest.length > 0 && (
            <span className="text-ink-soft">
              {' '}
              e mais {plural(rest.length, 'mudança', 'mudanças')}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
