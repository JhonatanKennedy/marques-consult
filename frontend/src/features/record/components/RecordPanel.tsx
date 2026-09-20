import { useState } from 'react';
import { Button } from '@jhonatankennedy/ui-react';
import { History } from 'lucide-react';
import type { ListVersion } from '@/domain/list';
import { VersionGroup } from '@/features/record/components/VersionGroup';
import { useVersionGroups } from '@/features/record/hooks/useVersionGroups';
import { dayKey } from '@/features/record/utils/dayKey';
import { plural } from '@/text/plural';

const PAGE = 60;

type RecordPanelProps = {
  versions: ListVersion[];
  currentNumber: number;

  isRestoring: (versionNumber: number) => boolean;
  onRestore: (number: number) => void;
};

export function RecordPanel({
  versions,
  currentNumber,
  isRestoring,
  onRestore,
}: RecordPanelProps) {
  const [openNumber, setOpenNumber] = useState<number | null>(null);
  const [limit, setLimit] = useState(PAGE);

  const { groups, hidden } = useVersionGroups(versions, limit);

  const toggle = (versionNumber: number) =>
    setOpenNumber((previous) =>
      previous === versionNumber ? null : versionNumber,
    );

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
            {groups.map((group) => (
              <VersionGroup
                key={dayKey(group.iso)}
                group={group}
                currentNumber={currentNumber}
                openNumber={openNumber}
                isRestoring={isRestoring}
                onToggle={toggle}
                onRestore={onRestore}
              />
            ))}

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
