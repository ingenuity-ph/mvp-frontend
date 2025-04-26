// import { del, get, set } from "idb-keyval";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import type {
//   PersistedClient,
//   Persister,
// } from "@tanstack/react-query-persist-client";

// const MINUTE = 1000 * 60;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // staleTime: ENABLE_PERSIST ? MINUTE * 15 : undefined,
      // 24 Hours

      // gcTime: 1440 * MINUTE,
      retry: 0,
    },
  },
});

/**
 * Creates an Indexed DB persister.
 *
 * @see https://react-query.tanstack.com/plugins/persistQueryClient#building-a-persistor
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
// function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery") {
//   return {
//     async persistClient(persistClient) {
//       await set(idbValidKey, persistClient);
//     },
//     restoreClient: async () => await get<PersistedClient>(idbValidKey),
//     removeClient: async () => {
//       await del(idbValidKey);
//     },
//   } satisfies Persister;
// }

// const persister = createIDBPersister();

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // return (
  //   <PersistQueryClientProvider
  //     client={queryClient}
  //     persistOptions={{ persister }}
  //   >
  //     {children}
  //   </PersistQueryClientProvider>
  // );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
