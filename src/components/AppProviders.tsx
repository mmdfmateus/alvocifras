'use client'

import { type PropsWithChildren } from 'react'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'

import { Header } from '~/components/Header'
import { TRPCReactProvider } from '~/components/TRPCReactProvider'

type AppProvidersProps = PropsWithChildren<{
  session: Session | null;
}>

export const AppProviders = ({ children, session }: AppProvidersProps) => {
  return (
    <TRPCReactProvider>
      <SessionProvider session={session}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Toaster />
          <Analytics />
          <Header />
          {children}
        </ThemeProvider>
      </SessionProvider>
    </TRPCReactProvider>
  )
}
