import type { Change } from '@/domain/list';
import { plural } from './format';

const quote = (value: string) => `“${value}”`;

export function headline(change: Change): string {
  switch (change.kind) {
    case 'created':
      return 'A lista começou vazia';
    case 'added':
      return `Adicionou ${quote(change.item.name)}`;
    case 'removed':
      return `Removeu ${quote(change.item.name)}`;
    case 'edited': {
      const fields = change.fields.map((field) =>
        field === 'name' ? 'o nome' : 'a descrição',
      );
      const joined =
        fields.length > 1
          ? `${fields[0]} e ${fields[1]}`
          : (fields[0] ?? 'o item');
      return `Mudou ${joined} de ${quote(change.before.name)}`;
    }
    case 'moved':
      return `Moveu ${quote(change.item.name)} da posição ${change.from} para a ${change.to}`;
    case 'shifted':
      return `${quote(change.item.name)} passou da posição ${change.from} para a ${change.to}`;
  }
}

export function shiftNote(count: number): string {
  return `${plural(count, 'item mudou', 'itens mudaram')} de posição como consequência`;
}
