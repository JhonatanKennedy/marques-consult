import { Button } from '@jhonatankennedy/ui-react';
import { Plus } from 'lucide-react';

export function EmptyList({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rule border-dashed border-line bg-sheet px-6 py-10">
      <h2 className="font-display text-headline leading-none">
        A lista está vazia
      </h2>
      <p className="mt-3 max-w-reading font-body text-body leading-relaxed">
        Cada mudança que você fizer aqui vira uma versão numerada no registro. É
        assim que, no meio de uma conversa, você consegue dizer o que mudou e
        quando.
      </p>
      <p className="mt-2 max-w-reading font-body text-body leading-relaxed text-ink-soft">
        Restaurar uma versão antiga volta a lista ao que ela era ali — e apaga
        as versões que vieram depois.
      </p>
      <div className="mt-5">
        <Button variant="primary" size="lg" onClick={onAdd}>
          <span className="inline-flex items-center gap-2">
            <Plus size={18} strokeWidth={3} aria-hidden="true" />
            Adicionar o primeiro item
          </span>
        </Button>
      </div>
    </div>
  );
}
