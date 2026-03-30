'use client'

import { use, type JSX } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dot } from 'lucide-react'

import { api } from '~/utils/api'
import { Separator } from '~/components/ui/separator'

type ArtistPageProps = {
  params: Promise<{
    id: string;
  }>;
}

export default function ArtistDetailPage ({ params }: ArtistPageProps): JSX.Element {
  const { id } = use(params)
  const { data: artist, isLoading: isLoadingArtist } = api.artists.getById.useQuery(id)

  let currentLetter = ''
  return (
    <main className='flex w-screen flex-col items-center'>
      {isLoadingArtist && <h2>Carregando...</h2>}
      {!isLoadingArtist && artist && (
        <div className='container flex max-w-screen-lg flex-col items-center gap-16 px-8 py-16'>
          <div className='flex items-center gap-4'>
            <Image
              src={artist.imageUrl}
              alt='artista'
              height={144}
              width={144}
              className='mr-4 aspect-square h-36 w-36 rounded-full shadow-2xl'
            />
            <div className='flex flex-col'>
              <h1 className='text-4xl'>{artist.name}</h1>
            </div>
          </div>
          <ul className='flex min-w-full flex-col'>
            {artist.songs.map((song) => {
              const showInitialLetter =
                song.name.charAt(0).toLocaleUpperCase() !== currentLetter
              currentLetter = song.name.charAt(0).toLocaleUpperCase()
              return (
                <li key={song.id}>
                  {showInitialLetter && (
                    <div>
                      <h3 className='pb-1 pl-2 text-2xl'>{currentLetter}</h3>
                      <Separator className='mb-1' />
                    </div>
                  )}
                  <Link
                    href={`/songs/${song.id}`}
                    className='mb-2 flex h-16 items-center rounded-md p-2 last:mb-3 hover:bg-primary-foreground'
                  >
                    <Dot size={36} />
                    <div className='space-y-1'>
                      <p className='text-sm font-semibold leading-none'>{song.name}</p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </main>
  )
}
