import { useList } from '@/app/useList';
import { AppHeader, ErrorBanner, ListColumn } from '@/features/list';
import { RecordColumn } from '@/features/record';

export function ListPage() {
  const list = useList();

  const dimmed = list.dims ? 'opacity-60 pointer-events-none' : '';

  return (
    <div className="flex min-h-dvh flex-col bg-ground text-ink lg:h-dvh">
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <main
          className={`flex min-w-0 flex-1 flex-col ${
            list.isBusy ? 'pointer-events-none' : ''
          }`}
        >
          <AppHeader
            itemCount={list.items.length}
            versionCount={list.history.length}
            dimmed={dimmed}
          />

          {list.error ? (
            <ErrorBanner
              error={list.error}
              onDismiss={list.dismissError}
              onRetry={() => void list.reload()}
            />
          ) : null}

          <ListColumn
            status={list.status}
            items={list.items}
            isBusy={list.isBusy}
            isRemoving={list.isRemoving}
            isMoving={list.isMoving}
            dimmed={dimmed}
            onAdd={list.add}
            onEdit={list.edit}
            onRemove={(id) => void list.remove(id)}
            onMove={(id, position) => void list.move(id, position)}
            onRetry={() => void list.reload()}
          />
        </main>

        <RecordColumn
          status={list.status}
          versions={list.history}
          currentNumber={list.current?.number ?? 0}
          isRestoring={list.isRestoring}
          onRestore={(number) => void list.restore(number)}
        />
      </div>
    </div>
  );
}
