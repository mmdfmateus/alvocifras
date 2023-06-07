import { type NextPage } from 'next'
import Head from 'next/head'

import { Separator } from '~/components/ui/separator'
import Link from 'next/link'
import { Dot } from 'lucide-react'
import { api } from '~/utils/api'

const Songs: NextPage = () => {
  let currentLetter = ''

  const { data: songs, isLoading } = api.songs.getAll.useQuery()

  return (
    <>
      <Head>
        <title>Músicas - Alvo Cifras</title>
        <meta name="description" content="Todos as músicas presentes no Alvo Cifras" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="flex w-screen flex-col items-center justify-center">
          <div className="container flex flex-col gap-12 px-8 py-16">
            <h1 className='text-4xl'>Músicas</h1>
            { isLoading && <h2>Carregando...</h2> }
            { songs &&
              <ul className='flex flex-col'>
                  {
                    songs.map((song, index) => {
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
                            className="mb-2 h-16 flex items-center p-2 rounded-md hover:bg-slate-100 last:mb-3"
                            >
                              <Dot size={36} />
                              <div className="space-y-1">
                                <p className="text-sm font-semibold leading-none">
                                  {song.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {song.artist}
                                </p>
                              </div>
                          </Link>
                      </>
                      )
                    })
                  }
              </ul>}
          </div>
        </main>
    </>
  )
}

export default Songs
