import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { AppProviders } from '~/components/AppProviders'

import '~/styles/globals.css'
import '~/styles/chordsStyles.css'
import '@uploadthing/react/styles.css'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <AppProviders session={session}>
        <Component className='container max-w-screen-lg' {...pageProps} />
    </AppProviders>
  )
}

export default MyApp
