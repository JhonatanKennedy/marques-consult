import { useState } from 'react';
import { Button } from '@jhonatankennedy/ui-react';
import { ChevronDown, ChevronRight, Undo2 } from 'lucide-react';
import type { Change, ListVersion } from '@/domain/list';
import { primaryChanges, shifts } from '@/domain/derive-changes';
import { headline, shiftNote } from '@/copy/record';
import { fullMoment, plural, timeOf } from '@/copy/format';
import { ChangeDetail } from '@/features/record/components/ChangeDetail';

const KIND: Record<Change['kind'], { label: string; ink: string }> = {
  created: { label: 'início', ink: 'var(--ink-restored)' },
  added: { label: 'adicionou', ink: 'var(--ink-added)' },
  removed: { label: 'removeu', ink: 'var(--ink-removed)' },
  edited: { label: 'editou', ink: 'var(--ink-edited)' },
  moved: { label: 'moveu', ink: 'var(--ink-moved)' },
  shifted: { label: 'deslocou', ink: 'var(--ink-moved)' },
};

interface Props {
  version: ListVersion;
  changes: Change[];
  isCurrent: boolean;
  open: boolean;
  busy: boolean;
  onToggle: () => void;
  onRestore: () => void;
}

export function VersionRow({
  version,
  changes,
  isCurrent,
  open,
  busy,
  onToggle,
  onRestore,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const primary = primaryChanges(changes);
  const lead = primary[0];
  const rest = primary.slice(1);
  const shifted = shifts(changes);
  const kind = KIND[lead?.kind ?? 'created'];

  return (
    <li
      className={`hairline ${open ? 'open-row my-1' : ''} ${
        isCurrent ? 'settle-in' : ''
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-white/5"
      >
        <span className="mt-0.5 shrink-0 text-ink-soft" aria-hidden="true">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
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

      {open && (
        <div className="grid gap-3 px-3 pb-3 pl-10">
          <p className="label font-mono text-label text-ink-soft">
            {fullMoment(version.createdAt)}
          </p>

          {primary.map((change, index) => (
            <ChangeDetail key={index} change={change} />
          ))}

          {shifted.length > 0 && (
            <details className="group">
              <summary className="disclosure flex cursor-pointer items-center gap-1 font-mono text-label text-ink-soft hover:text-record-ink">
                <ChevronRight
                  size={14}
                  aria-hidden="true"
                  className="shrink-0 transition-transform group-open:rotate-90"
                />
                {shiftNote(shifted.length)}
              </summary>
              <ul className="mt-2 grid gap-1">
                {shifted.map((change, index) => (
                  <li key={index}>
                    <ChangeDetail change={change} />
                  </li>
                ))}
              </ul>
            </details>
          )}

          {!isCurrent && (
            <div className="mt-1 grid gap-2 border-t border-hairline pt-3">
              {confirming ? (
                <>
                  <p className="font-body text-mono leading-snug text-record-ink">
                    A lista volta ao que era na versão {version.number}.{' '}
                    <strong>
                      As versões seguintes serão apagadas, e isso não pode ser
                      desfeito.
                    </strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="on-fill"
                      disabled={busy}
                      onClick={onRestore}
                    >
                      {busy
                        ? 'Restaurando…'
                        : `Restaurar a versão ${version.number}`}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => setConfirming(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => setConfirming(true)}
                  >
                    <Undo2 size={15} strokeWidth={2.5} aria-hidden="true" />
                    Restaurar esta versão
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
