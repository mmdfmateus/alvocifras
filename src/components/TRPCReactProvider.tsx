'use client'

import { type ComponentType, type PropsWithChildren, useState } from 'react'
import * as ReactQuery from '@tanstack/react-query'
import { loggerLink, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

import { api, getBaseUrl } from '~/utils/api'

type TRPCReactProviderProps = PropsWithChildren<{
  trpcState?: ReactQuery.DehydratedState;
}>

type HydrationProps = PropsWithChildren<{
  state?: ReactQuery.DehydratedState;
}>

const HydrationBoundaryCompat = (
  ReactQuery as unknown as {
    HydrationBoundary?: ComponentType<HydrationProps>;
    Hydrate?: ComponentType<HydrationProps>;
  }
).HydrationBoundary ?? (
  ReactQuery as unknown as {
    Hydrate?: ComponentType<HydrationProps>;
  }
).Hydrate

export const TRPCReactProvider = ({
  children,
  trpcState
}: TRPCReactProviderProps) => {
  const [queryClient] = useState(() => new ReactQuery.QueryClient())
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
    <ReactQuery.QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {HydrationBoundaryCompat
          ? <HydrationBoundaryCompat state={trpcState}>{children}</HydrationBoundaryCompat>
          : children}
      </api.Provider>
    </ReactQuery.QueryClientProvider>
  )
}
