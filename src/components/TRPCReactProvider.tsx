'use client'

import { type PropsWithChildren, useState } from 'react'
import {
  type DehydratedState,
  Hydrate,
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
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error)
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`
        })
      ]
    })
  )

  const hydratedState = api.useDehydratedState(trpcClient, trpcState)

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={hydratedState}>{children}</Hydrate>
      </QueryClientProvider>
    </api.Provider>
  )
}
