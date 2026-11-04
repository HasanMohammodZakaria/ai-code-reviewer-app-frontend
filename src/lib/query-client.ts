import { QueryClient } from "@tanstack/react-query";
import { isNormalizedError } from "../api/errors";

const MAX_RETRIES = 1;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Retry only network failures and server errors, never 4xx (403, 404, 429...)
      retry: (failureCount, error) => {
        if (failureCount >= MAX_RETRIES) return false;
        if (isNormalizedError(error)) {
          return error.status === 0 || error.status >= 500;
        }
        return false;
      },
    },
    mutations: {
      // Mutations (run review, create, delete) are never retried automatically
      retry: false,
    },
  },
});
