import { type NextPage } from 'next'
import Head from 'next/head'

import Image from 'next/image'
import { Separator } from '~/components/ui/separator'
import Link from 'next/link'

const songs = [
  {
    id: 'Algo melhor',
    song: 'Algo melhor',
    artist: 'Sujeito a Reboque',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd-msomLi9iPCsy56AD6P6qV52munNoPtoztyiRgsFRoO3E2YTQobSBR9mbo6-YEW4DXw&usqp=CAU'
  },
  {
    id: 'Algo melhorr',
    song: 'Algo melhor',
    artist: 'Sujeito a Reboque',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd-msomLi9iPCsy56AD6P6qV52munNoPtoztyiRgsFRoO3E2YTQobSBR9mbo6-YEW4DXw&usqp=CAU'
  },
  {
    id: 'Algo melhor',
    song: 'bAlgo melhor',
    artist: 'Sujeito a Reboque',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd-msomLi9iPCsy56AD6P6qV52munNoPtoztyiRgsFRoO3E2YTQobSBR9mbo6-YEW4DXw&usqp=CAU'
  }
]

const Songs: NextPage = () => {
  let currentLetter = ''

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
            <ul className='flex flex-col'>
                {
                  songs.map((song, index) => {
                    const showInitialLetter = song.artist.charAt(0).toLocaleUpperCase() !== currentLetter
                    currentLetter = song.artist.charAt(0).toLocaleUpperCase()
                    return (<>
                        { showInitialLetter &&
                          <div>
                            <h3 className='text-2xl pb-1 pl-2'>{currentLetter}</h3>
                            <Separator className='mb-1' />
                          </div>
                        }
                        <Link
                          href={`/${song.id}`}
                          key={index}
                          className="mb-2 h-16 flex items-center p-2 rounded-md hover:bg-slate-100 last:mb-3"
                          >
                          <Image
                            src={`${song.imageUrl}.jpg`}
                            alt='artista'
                            height={48}
                            width={48}
                            className='h-12 w-12 rounded-full mr-4'
                            />
                            <div className="space-y-1 flex items-center">
                              <p className="text-sm font-semibold leading-none">
                                {song.artist}
                              </p>
                            </div>
                        </Link>
                    </>
                    )
                  })
                }
            </ul>
          </div>
        </main>
    </>
  )
}

export default Songs