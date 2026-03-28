'use client'

import { type PropsWithChildren, useState } from 'react'
import {
  type DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { loggerLink, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

import { api, getBaseUrl } from '~/utils/api'

type TRPCReactProviderProps = PropsWithChildren<{
  trpcState?: DehydratedState;
}>

export const TRPCReactProvider = ({
  children,
  trpcState
}: TRPCReactProviderProps) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error)
        }),
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`
        })
      ]
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <HydrationBoundary state={trpcState}>{children}</HydrationBoundary>
      </api.Provider>
    </QueryClientProvider>
  )
}
