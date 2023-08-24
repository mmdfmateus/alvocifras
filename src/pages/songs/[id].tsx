import { type NextPage, type GetStaticProps, type GetStaticPaths, type InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { api } from '~/utils/api'
import { ChordLyricsPair, ChordSheetSerializer, HtmlDivFormatter, Song } from 'chordsheetjs'
import { appRouter } from '~/server/api/root'
import { prisma } from '~/server/db'
import superjson from 'superjson'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { buildVideoUrl } from '~/components/AddSongForm'
import { Button } from '~/components/ui/button'
import { useMemo, useState } from 'react'
import { Play, X } from 'lucide-react'

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

const videoHeight = '315'
const Songs: NextPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const { data: song, isLoading: isLoadingSong } = api.songs.getById.useQuery(props.id)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const songParsed = isLoadingSong ? new Song() : serializer.deserialize(JSON.parse(song?.chords?.toString() ?? ''))

  const [showVideo, setShowVideo] = useState(false)

  const lyrics = useMemo(() => {
    return songParsed.lines.map((line) => (
      line.items.map((item) => {
        if (item instanceof ChordLyricsPair) {
          return item.lyrics
        }

        return ''
      }).join('')
    ))
  }, [songParsed.lines])

  return (
    <>
      <Head>
        <title>{song?.name} - {song?.artist.name}</title>
        <meta name="description" content={`Aprenda a cifra de ${song!.name} do artista ${song!.artist.name} aqui no Alvo Cifras`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="flex w-screen flex-col items-center">
          {!isLoadingSong && song &&
          <>
            <div className={`sticky ${showVideo ? 'visible' : 'hidden'}`}>
              {song.videoId && (<iframe
                    width="420"
                    height={videoHeight}
                    src={buildVideoUrl(song.videoId, 'embed')}>
                  </iframe>)}
            </div>
            <div className={`container max-w-screen-lg flex flex-col gap-10 px-8 py-16 ${showVideo ? 'pt-8' : ''}`}>
                <div className='flex gap-4 items-center justify-between'>
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
                </div>
                <Tabs defaultValue='chords'>
                  <div className='flex gap-6 items-center'>
                    <TabsList className='ml-6 py-6 px-2'>
                      <TabsTrigger value='chords' className='py-2 px-5'>Cifra</TabsTrigger>
                      <TabsTrigger value='lyrics' className='py-2 px-5'>Letra</TabsTrigger>
                    </TabsList>
                    {song.videoId &&
                      <Button
                        variant={showVideo ? 'outline' : 'outline'}
                        size='sm'
                        onClick={() => setShowVideo(prev => !prev)}
                      >
                        {showVideo
                          ? (<X className="mr-1 h-4 w-4" />)
                          : (<Play className="mr-2 h-4 w-4" />)}
                        <span>{showVideo ? 'Fechar video' : 'Escutar'}</span>
                      </Button>}
                  </div>
                  <TabsContent value='chords'>
                    <div
                      className='mt-8 ml-2'
                      dangerouslySetInnerHTML={{ __html: formatter.format(songParsed) }} />
                  </TabsContent>
                  <TabsContent value='lyrics'>
                    <div
                      className='mt-8 ml-2'
                      dangerouslySetInnerHTML={{ __html: lyrics.join('<br>') }} />
                  </TabsContent>
                </Tabs>
            </div>
          </>
          }
        </main>
    </>
  )
}

export default Songs
