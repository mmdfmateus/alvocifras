import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { Header } from '~/components/Header'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'

import { api } from '~/utils/api'

import '~/styles/globals.css'
import '~/styles/chordsStyles.css'
import '@uploadthing/react/styles.css'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <Analytics />
      <Header />
      <Component className='container max-w-screen-lg' {...pageProps} />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
