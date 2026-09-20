import { QueryClient } from '@tanstack/react-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
        networkMode: 'always',
      },
      queries: {
        retry: false,
        networkMode: 'always',
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        staleTime: Infinity,
        gcTime: Infinity,
      },
    },
  });
}
