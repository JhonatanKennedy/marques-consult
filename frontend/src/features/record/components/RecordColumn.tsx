import type { Status } from '@/infrastructure/listQuery';
import type { ListVersion } from '@/domain/list';
import { RecordPanel } from '@/features/record/components/RecordPanel';
import { RecordSkeleton } from '@/features/record/components/RecordSkeleton';

type RecordColumnProps = {
  status: Status;
  versions: ListVersion[];
  currentNumber: number;
  isRestoring: (versionNumber: number) => boolean;
  onRestore: (versionNumber: number) => void;
};

export function RecordColumn({
  status,
  versions,
  currentNumber,
  isRestoring,
  onRestore,
}: RecordColumnProps) {
  return (
    <div className="flex min-h-0 flex-col border-t-3 border-line lg:w-record lg:shrink-0 lg:border-t-0 lg:border-l-3">
      {status === 'loading' ? (
        <div className="record flex h-full min-h-0 flex-col">
          <header className="topbar flex shrink-0 items-center gap-3 border-b-3 border-hairline px-4">
            <span className="font-display text-title leading-none">
              Registro
            </span>
          </header>
          <div className="min-h-0 flex-1 px-4 py-4 lg:overflow-y-auto">
            <RecordSkeleton />
          </div>
        </div>
      ) : (
        <RecordPanel
          versions={versions}
          currentNumber={currentNumber}
          isRestoring={isRestoring}
          onRestore={onRestore}
        />
      )}
    </div>
  );
}
