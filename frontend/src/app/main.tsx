import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@jhonatankennedy/ui-react/styles.css';
import '../index.css';
import { createQueryClient } from '@/infrastructure/query-client';
import { ListPage } from './ListPage';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Mount point #root is missing from index.html');
}

const queryClient = createQueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ListPage />
    </QueryClientProvider>
  </StrictMode>,
);
