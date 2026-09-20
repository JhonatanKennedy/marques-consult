import type { Change, ListVersion } from '@/domain/list';
import { RestoreAction } from '@/features/record/components/RestoreAction';
import { VersionChanges } from '@/features/record/components/VersionChanges';
import { VersionRowHeader } from '@/features/record/components/VersionRowHeader';
import type { VersionRowState } from '@/features/record/utils/versionRowState';

type VersionRowProps = {
  version: ListVersion;
  changes: Change[];
  state: VersionRowState;
  onToggle: () => void;
  onRestore: () => void;
};

export function VersionRow({
  version,
  changes,
  state,
  onToggle,
  onRestore,
}: VersionRowProps) {
  const isOpen = state.isOpen;
  const isCurrent = state.kind === 'current';

  return (
    <li
      className={`hairline ${isOpen ? 'open-row my-1' : ''} ${
        isCurrent ? 'settle-in' : ''
      }`}
    >
      <VersionRowHeader
        version={version}
        changes={changes}
        state={state}
        onToggle={onToggle}
      />

      {isOpen && (
        <div className="grid gap-3 px-3 pb-3 pl-10">
          <VersionChanges version={version} changes={changes} />

          {state.kind === 'past' && (
            <RestoreAction
              versionNumber={version.number}
              isRestoring={state.isRestoring}
              onRestore={onRestore}
            />
          )}
        </div>
      )}
    </li>
  );
}
