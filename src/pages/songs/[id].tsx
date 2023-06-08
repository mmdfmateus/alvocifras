import { type NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { api } from '~/utils/api'
import { useRouter } from 'next/router'

const Songs: NextPage = () => {
  const router = useRouter()

  const { data: song, isLoading: isLoadingSong } = api.songs.getById.useQuery(router.query.id as string ?? '')

  console.log(song)

  return (
    <>
      <Head>
        <title>Músicas - Alvo Cifras</title>
        <meta name="description" content="Todos as músicas presentes no Alvo Cifras" />
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
                  dangerouslySetInnerHTML={{ __html: song.chords as string }} />
            </div>
          }
        </main>
    </>
  )
}

export default Songs
