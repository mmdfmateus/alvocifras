import { type NextPage, type GetStaticProps, type GetStaticPaths, type InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { api } from '~/utils/api'
import { ChordSheetSerializer, HtmlDivFormatter, Song } from 'chordsheetjs'
import { appRouter } from '~/server/api/root'
import { prisma } from '~/server/db'
import superjson from 'superjson'
import { createServerSideHelpers } from '@trpc/react-query/server'

const serializer = new ChordSheetSerializer()
const formatter = new HtmlDivFormatter()

export const getStaticPaths: GetStaticPaths = async () => {
  const songs = await prisma.song.findMany({
    select: {
      id: true,
    },
  })

  return {
    paths: songs.map((song) => ({
      params: {
        id: song.id,
      },
    })),
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  // const session = await getServerAuthSession(context)
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  })

  const id = context.params?.id

  if (typeof id !== 'string') { throw new Error('no song id') }

  await helpers.songs.getById.prefetch(id)

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id
    },
    revalidate: 60 * 60
  }
}

const Songs: NextPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const { data: song, isLoading: isLoadingSong } = api.songs.getById.useQuery(props.id)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const songParsed = isLoadingSong ? new Song() : serializer.deserialize(JSON.parse(song?.chords?.toString() ?? ''))

  return (
    <>
      <Head>
        <title>{song?.name} - {song?.artist.name}</title>
        <meta name="description" content={`Aprenda a cifra de ${song!.name} do artista ${song!.artist.name} aqui no Alvo Cifras`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="flex w-screen flex-col items-center">
          { isLoadingSong && <h2>Carregando...</h2> }
          {!isLoadingSong && song &&
            <div className="container max-w-screen-lg flex flex-col gap-12 px-8 py-16">
                <div className='flex gap-4 items-center'>
                  <Image
                    src={song.artist.imageUrl}
                    alt='artista'
                    height={96}
                    width={96}
                    className='h-24 w-24 rounded-full mr-4 shadow-2xl'
                  />
                  <div className='flex flex-col'>
                    <h1 className='text-4xl'>{song.name}</h1>
                    <h3 className='text-xl text-muted-foreground'>{song.artist.name}</h3>
                  </div>
                </div>
                <div
                  className='mt-3 ml-2'
                  dangerouslySetInnerHTML={{ __html: formatter.format(songParsed) }} />
            </div>
          }
        </main>
    </>
  )
}

export default Songs
