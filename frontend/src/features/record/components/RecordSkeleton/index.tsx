const RECORD_SKELETON_ROWS = 5;
const RECORD_SKELETON_HEIGHT = 'h-record-row';
const RECORD_SKELETON_STAGGER_MS = 90;

export function RecordSkeleton() {
  return (
    <div className="grid gap-3 px-1 py-2" aria-hidden="true">
      {[...Array(RECORD_SKELETON_ROWS).keys()].map((row) => (
        <div
          key={row}
          className={`skeleton ${RECORD_SKELETON_HEIGHT} border border-hairline`}
          style={{ animationDelay: `${row * RECORD_SKELETON_STAGGER_MS}ms` }}
        />
      ))}
    </div>
  );
}
