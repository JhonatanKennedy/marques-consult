import { SectionTitle } from '@jhonatankennedy/ui-react';
import { VersionRow } from '@/features/record/components/VersionRow';
import type { DayGroup } from '@/features/record/hooks/useVersionGroups';
import { versionStateOf } from '@/features/record/utils/versionRowState';
import { dayHeading } from '@/text/dates';

type VersionGroupProps = {
  group: DayGroup;
  currentNumber: number;
  openNumber: number | null;
  isRestoring: (versionNumber: number) => boolean;
  onToggle: (versionNumber: number) => void;
  onRestore: (versionNumber: number) => void;
};

export function VersionGroup({
  group,
  currentNumber,
  openNumber,
  isRestoring,
  onToggle,
  onRestore,
}: VersionGroupProps) {
  const heading = dayHeading(group.iso);

  return (
    <section>
      <SectionTitle number={heading.kicker} title={heading.day} />
      <ul className="mt-3">
        {group.rows.map((entry) => (
          <VersionRow
            key={entry.version.number}
            version={entry.version}
            changes={entry.changes}
            state={versionStateOf(
              entry.version.number === currentNumber,
              openNumber === entry.version.number,
              isRestoring(entry.version.number),
            )}
            onToggle={() => onToggle(entry.version.number)}
            onRestore={() => onRestore(entry.version.number)}
          />
        ))}
      </ul>
    </section>
  );
}
