import { plural } from '@/text/plural';

type AppHeaderProps = {
  itemCount: number;
  versionCount: number;
  dimmed: string;
};

export function AppHeader({ itemCount, versionCount, dimmed }: AppHeaderProps) {
  return (
    <header className="topbar flex shrink-0 items-center border-b-3 border-line">
      <div className={`measure flex items-center gap-4 px-6 ${dimmed}`}>
        <div className="min-w-0">
          <h1 className="font-display text-display leading-none">A lista</h1>
          <p className="mt-1 font-mono text-label tabular-nums text-ink-soft">
            {plural(itemCount, 'item', 'itens')} ·{' '}
            {plural(versionCount, 'versão', 'versões')}
          </p>
        </div>
      </div>
    </header>
  );
}
