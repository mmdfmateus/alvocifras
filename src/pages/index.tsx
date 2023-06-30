import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'

import Image from 'next/image'
import Link from 'next/link'
import { HomeCard } from '~/components/HomeCard'
import { api } from '~/utils/api'
import { appRouter } from '~/server/api/root'
import { prisma } from '~/server/db'
import superjson from 'superjson'
import { createServerSideHelpers } from '@trpc/react-query/server'

export const getStaticProps: GetStaticProps = async () => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  })

  await helpers.songs.getAll.prefetch({ take: 3, includeArtist: true })
  await helpers.artists.getAll.prefetch({ take: 3 })

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
    revalidate: 60 * 60 * 24
  }
}

const Home: NextPage = () => {
  const { data: songs } = api.songs.getAll.useQuery({ take: 3, includeArtist: true })
  const { data: artists } = api.artists.getAll.useQuery({ take: 3 })

  return (
    <>
      <Head>
        <title>Alvo Cifras</title>
        <meta name="description" content="Aprenda a tocar suas músicas favoritas de Alvo" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
        <main className="flex w-screen flex-col items-center justify-center">
          <div className="container flex flex-col md:flex-row items-center justify-center gap-12 px-4 py-16">
            {/* { isLoadingSongs && <h2>Carregando...</h2> } */}
            { <HomeCard title='Músicas' buttonTitle='Ver todas' buttonRedirectTo='/songs'>
                {songs!.map((song, index) => (
                  <Link
                    href={`/songs/${song.id}`}
                    key={index}
                    className="mb-4 h-16 flex items-center p-2 rounded-md hover:bg-primary-foreground last:mb-0"
                  >
                    <Image
                      src={`${song.artist.imageUrl}`}
                      alt='artista'
                      height={48}
                      width={48}
                      className='h-12 w-12 rounded-full mr-4'
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {song.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {song.artist.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </HomeCard>
            }

            {/* { isLoadingArtists && <h2>Carregando...</h2> } */}
            { <HomeCard title='Artistas' buttonTitle='Ver todos' buttonRedirectTo='/artists'>
                {artists!.map((artist, index) => (
                  <Link
                    href={`/artists/${artist.id}`}
                    key={index}
                    className="mb-4 h-16 flex items-center p-2 rounded-md hover:bg-primary-foreground last:mb-0"
                  >
                    <Image
                      src={`${artist.imageUrl}`}
                      alt='artista'
                      height={48}
                      width={48}
                      className='h-12 w-12 rounded-full mr-4'
                      />
                    <div className="space-y-1 flex items-center">
                      <p className="text-sm font-semibold leading-none">
                        {artist.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </HomeCard>
            }
          </div>

        </main>
    </>
  )
}

export default Home
