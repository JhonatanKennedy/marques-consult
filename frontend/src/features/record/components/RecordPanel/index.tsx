import { useMemo, useState } from 'react';
import { Button, SectionTitle } from '@jhonatankennedy/ui-react';
import { History } from 'lucide-react';
import type { Change, ListVersion } from '@/domain/list';
import { deriveChanges } from '@/domain/derive-changes';
import { dayHeading, dayKey, plural } from '@/copy/format';
import { VersionRow } from '@/features/record/components/VersionRow';

const PAGE = 60;

interface DiffEntry {
  version: ListVersion;
  changes: Change[];
}

interface Props {
  versions: ListVersion[];
  currentNumber: number;

  isRestoring: (versionNumber: number) => boolean;
  onRestore: (number: number) => void;
}

export function RecordPanel({
  versions,
  currentNumber,
  isRestoring,
  onRestore,
}: Props) {
  const [openNumber, setOpenNumber] = useState<number | null>(null);
  const [limit, setLimit] = useState(PAGE);

  const entries = useMemo<DiffEntry[]>(() => {
    const ascending = [...versions].reverse();
    return ascending.map((version, index) => ({
      version,
      changes: deriveChanges(
        index === 0 ? null : ascending[index - 1],
        version,
      ),
    }));
  }, [versions]);

  const newestFirst = useMemo(() => [...entries].reverse(), [entries]);

  const groups = useMemo(() => {
    const byDay = new Map<string, { iso?: string; rows: typeof newestFirst }>();
    for (const entry of newestFirst.slice(0, limit)) {
      const key = dayKey(entry.version.createdAt);
      const group = byDay.get(key);
      if (group) group.rows.push(entry);
      else byDay.set(key, { iso: entry.version.createdAt, rows: [entry] });
    }
    return [...byDay.values()];
  }, [newestFirst, limit]);

  const hidden = Math.max(newestFirst.length - limit, 0);

  return (
    <aside
      aria-label="Registro de versões"
      className="record flex h-full min-h-0 flex-col"
    >
      <header className="topbar flex shrink-0 items-center gap-3 border-b-3 border-hairline px-4">
        <History size={18} strokeWidth={2.5} aria-hidden="true" />
        <h2 className="font-display text-title leading-none">Registro</h2>
        <span className="font-mono text-label tabular-nums text-ink-soft">
          {plural(versions.length, 'versão', 'versões')}
        </span>
      </header>

      <div className="min-h-0 flex-1 px-4 py-4 lg:overflow-y-auto">
        {groups.length === 0 ? (
          <p className="font-body text-body leading-relaxed text-ink-soft">
            O registro começa na primeira mudança que você fizer.
          </p>
        ) : (
          <div className="grid gap-6">
            {groups.map((group) => {
              const heading = dayHeading(group.iso);
              return (
                <section key={dayKey(group.iso)}>
                  <SectionTitle number={heading.kicker} title={heading.day} />
                  <ul className="mt-3">
                    {group.rows.map((entry) => (
                      <VersionRow
                        key={entry.version.number}
                        version={entry.version}
                        changes={entry.changes}
                        isCurrent={entry.version.number === currentNumber}
                        open={openNumber === entry.version.number}
                        busy={isRestoring(entry.version.number)}
                        onToggle={() =>
                          setOpenNumber((previous) =>
                            previous === entry.version.number
                              ? null
                              : entry.version.number,
                          )
                        }
                        onRestore={() => onRestore(entry.version.number)}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}

            {hidden > 0 && (
              <div>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setLimit((previous) => previous + PAGE)}
                >
                  Mostrar as {Math.min(hidden, PAGE)} versões anteriores
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
