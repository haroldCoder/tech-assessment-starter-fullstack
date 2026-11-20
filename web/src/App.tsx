import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CatalogTreeView } from './features/presentation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="app-main">
        <CatalogTreeView />
      </main>
    </QueryClientProvider>
  );
}

export default App;
