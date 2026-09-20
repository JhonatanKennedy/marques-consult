const LIST_SKELETON_ROWS = 3;
const LIST_SKELETON_HEIGHT = 'h-item-row';
const LIST_SKELETON_STAGGER_MS = 120;

export function ListSkeleton() {
  return (
    <div className="grid gap-3" aria-hidden="true">
      {[...Array(LIST_SKELETON_ROWS).keys()].map((row) => (
        <div
          key={row}
          className={`skeleton rule ${LIST_SKELETON_HEIGHT} border-line bg-sheet`}
          style={{ animationDelay: `${row * LIST_SKELETON_STAGGER_MS}ms` }}
        />
      ))}
    </div>
  );
}
