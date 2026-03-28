import '~/styles/globals.css'
import '~/styles/chordsStyles.css'
import '@uploadthing/react/styles.css'

import { type ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import type { Metadata } from 'next'

import { AppProviders } from '~/components/AppProviders'
import { authOptions } from '~/server/auth'

export const metadata: Metadata = {
  title: 'Alvo Cifras',
  description: 'Aprenda a tocar suas músicas favoritas de Alvo',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
}

type RootLayoutProps = {
  children: ReactNode;
}

export default async function RootLayout ({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions)

  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <AppProviders session={session}>{children}</AppProviders>
      </body>
    </html>
  )
}
