import { type NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { api } from '~/utils/api'
import { useRouter } from 'next/router'
import { Separator } from '~/components/ui/separator'
import Link from 'next/link'
import { Dot } from 'lucide-react'

const ArtistPage: NextPage = () => {
  let currentLetter = ''
  const router = useRouter()

  const { data: artist, isLoading: isLoadingArtist } = api.artists.getById.useQuery(router.query.id as string ?? '')

  return (
    <>
      <Head>
        <title>{artist?.name} - Alvo Cifras</title>
        <meta name="description" content={`Aprenda as cifras do artista ${artist!.name} aqui no Alvo Cifras`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="flex w-screen flex-col items-center">
          { isLoadingArtist && <h2>Carregando...</h2> }
          {!isLoadingArtist && artist &&
            <div className="container max-w-screen-lg flex flex-col items-center gap-16 px-8 py-16">
                <div className='flex gap-4 items-center'>
                  <Image
                    src={artist.imageUrl}
                    alt='artista'
                    height={144}
                    width={144}
                    className='h-36 w-36 rounded-full mr-4 shadow-2xl aspect-square' // test aspect ratio
                  />
                  <div className='flex flex-col'>
                    <h1 className='text-4xl'>{artist.name}</h1>
                  </div>
                </div>
                <ul className='flex flex-col min-w-full'>
                  {
                    artist.songs.map((song, index) => {
                      const showInitialLetter = song.name.charAt(0).toLocaleUpperCase() !== currentLetter
                      currentLetter = song.name.charAt(0).toLocaleUpperCase()
                      return (<>
                          { showInitialLetter &&
                            <div>
                              <h3 className='text-2xl pb-1 pl-2'>{currentLetter}</h3>
                              <Separator className='mb-1' />
                            </div>
                          }
                          <Link
                            href={`/songs/${song.id}`}
                            key={index}
                            className="mb-2 h-16 flex items-center p-2 rounded-md hover:bg-primary-foreground last:mb-3"
                            >
                              <Dot size={36} />
                              <div className="space-y-1">
                                <p className="text-sm font-semibold leading-none">
                                  {song.name}
                                </p>
                              </div>
                          </Link>
                      </>
                      )
                    })
                  }
                </ul>
            </div>
          }
        </main>
    </>
  )
}

export default ArtistPage
