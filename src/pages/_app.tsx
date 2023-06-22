import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { Header } from '~/components/Header'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'

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
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <Toaster />
        <Analytics />
        <Header />
        <Component className='container max-w-screen-lg' {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
