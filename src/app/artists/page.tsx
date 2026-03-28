'use client'

import type { JSX } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Separator } from '~/components/ui/separator'
import { api } from '~/utils/api'

export default function ArtistsPage (): JSX.Element {
  let currentLetter = ''

  const { data: artists, isLoading } = api.artists.getAll.useQuery()

  return (
    <main className='flex w-screen flex-col items-center justify-center'>
      <div className='container flex flex-col gap-12 px-8 py-16'>
        <h1 className='text-4xl'>Artistas</h1>
        {isLoading && <h2>Carregando...</h2>}
        {artists && (
          <ul className='flex flex-col'>
            {artists.map((artist) => {
              const showInitialLetter =
                artist.name.charAt(0).toLocaleUpperCase() !== currentLetter
              currentLetter = artist.name.charAt(0).toLocaleUpperCase()

              return (
                <li key={artist.id}>
                  {showInitialLetter && (
                    <div>
                      <h3 className='pb-1 pl-2 text-2xl'>{currentLetter}</h3>
                      <Separator className='mb-1' />
                    </div>
                  )}
                  <Link
                    href={`/artists/${artist.id}`}
                    className='mb-2 flex h-16 items-center rounded-md p-2 last:mb-3 hover:bg-primary-foreground'
                  >
                    <Image
                      src={`${artist.imageUrl}`}
                      alt='artista'
                      height={48}
                      width={48}
                      className='mr-4 h-12 w-12 rounded-full shadow-xl'
                    />
                    <div className='flex items-center space-y-1'>
                      <p className='text-sm font-semibold leading-none'>{artist.name}</p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}
