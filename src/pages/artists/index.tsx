import { type NextPage, type GetStaticPropsContext } from 'next'
import Head from 'next/head'

import Image from 'next/image'
import { Separator } from '~/components/ui/separator'
import Link from 'next/link'
import { api } from '~/utils/api'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '~/server/api/root'
import { prisma } from '~/server/db'
import superjson from 'superjson'

export async function getStaticProps (
  context: GetStaticPropsContext,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  })

  await helpers.artists.getAll.prefetch()

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
    revalidate: 60 * 60 * 24,
  }
}

const Artists: NextPage = () => {
  let currentLetter = ''

  const { data: artists, isLoading } = api.artists.getAll.useQuery()

  return (
    <>
      <Head>
        <title>Artistas - Alvo Cifras</title>
        <meta name="description" content="Todos os artistas presentes no Alvo Cifras" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="flex w-screen flex-col items-center justify-center">
          <div className="container flex flex-col gap-12 px-8 py-16">
            <h1 className='text-4xl'>Artistas</h1>
            { isLoading && <h2>Carregando...</h2> }
            { artists &&
              <ul className='flex flex-col'>
                  {
                    artists.map((artist, index) => {
                      const showInitialLetter = artist.name.charAt(0).toLocaleUpperCase() !== currentLetter
                      currentLetter = artist.name.charAt(0).toLocaleUpperCase()
                      return (
                      <li key={artist.id}>
                          { showInitialLetter &&
                            <div>
                              <h3 className='text-2xl pb-1 pl-2'>{currentLetter}</h3>
                              <Separator className='mb-1' />
                            </div>
                          }
                          <Link
                            href={`/artists/${artist.id}`}
                            key={index}
                            className="mb-2 h-16 flex items-center p-2 rounded-md hover:bg-primary-foreground last:mb-3"
                            >
                            <Image
                              src={`${artist.imageUrl}`}
                              alt='artista'
                              height={48}
                              width={48}
                              className='h-12 w-12 rounded-full mr-4 shadow-xl'
                              />
                              <div className="space-y-1 flex items-center">
                                <p className="text-sm font-semibold leading-none">
                                  {artist.name}
                                </p>
                              </div>
                          </Link>
                      </li>
                      )
                    })
                  }
              </ul>}
          </div>
        </main>
    </>
  )
}

export default Artists
