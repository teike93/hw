import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create a client instance
  // We use useState to ensure the client is only created once
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Time before data is considered stale
            staleTime: 1000 * 60 * 5, // 5 minutes
            // Time before inactive queries are removed from cache
            gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
            // Retry failed requests 2 times
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors (client errors)
              if (error?.response?.status >= 400 && error?.response?.status < 500) {
                return false;
              }
              // Retry up to 2 times for other errors
              return failureCount < 2;
            },
            // Retry delay increases exponentially
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus (can be disabled if needed)
            refetchOnWindowFocus: false,
            // Refetch on reconnect
            refetchOnReconnect: 'always',
          },
          mutations: {
            // Retry mutations once
            retry: 1,
            // Show user-friendly error messages
            onError: (error: any) => {
              console.error('Mutation error:', error);
              // Here you could show a toast notification
              // toast.error(error?.message || 'An error occurred');
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query dev tools in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}