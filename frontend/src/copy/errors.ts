import { ApiError, NetworkError } from '@/infrastructure/errors';

const STATUS_NOT_FOUND = 404;
const STATUS_SERVER_ERROR_FLOOR = 500;

export function describeError(error: unknown): {
  title: string;
  detail: string;
} {
  if (error instanceof NetworkError) {
    return {
      title: 'Não foi possível falar com o servidor',
      detail:
        'A lista não respondeu. Confira se ela está no ar e tente de novo.',
    };
  }
  if (error instanceof ApiError) {
    if (error.status === STATUS_NOT_FOUND) {
      return {
        title: 'Esse item não está mais na lista',
        detail:
          'Alguém ou você mesmo já removeu este item. A lista foi recarregada com o estado atual.',
      };
    }
    if (error.status >= STATUS_SERVER_ERROR_FLOOR) {
      return {
        title: 'A lista não conseguiu concluir a mudança',
        detail:
          'Nada foi gravado e o registro continua intacto. Tente outra vez em alguns segundos.',
      };
    }
    return {
      title: 'A mudança foi recusada',
      detail: `O servidor respondeu ${error.status}. A lista não mudou.`,
    };
  }
  return {
    title: 'Algo deu errado',
    detail: 'A mudança não foi gravada. A lista continua como estava.',
  };
}
