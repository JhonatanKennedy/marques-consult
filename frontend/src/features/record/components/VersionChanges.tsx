import { ChevronRight } from 'lucide-react';
import type { Change, ListVersion } from '@/domain/list';
import { primaryChanges, shifts } from '@/domain/deriveChanges';
import { ChangeDetail } from '@/features/record/components/ChangeDetail';
import { changeKey } from '@/features/record/utils/changeKey';
import { fullMoment } from '@/text/dates';
import { shiftNote } from '@/text/record';

type VersionChangesProps = {
  version: ListVersion;
  changes: Change[];
};

export function VersionChanges({ version, changes }: VersionChangesProps) {
  const primary = primaryChanges(changes);
  const shifted = shifts(changes);

  return (
    <>
      <p className="label font-mono text-label text-ink-soft">
        {fullMoment(version.createdAt)}
      </p>

      {primary.map((change) => (
        <ChangeDetail key={changeKey(change)} change={change} />
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
            {shifted.map((change) => (
              <li key={changeKey(change)}>
                <ChangeDetail change={change} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
