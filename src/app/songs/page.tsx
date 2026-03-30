'use client'

import type { JSX } from 'react'
import Link from 'next/link'
import { Dot } from 'lucide-react'

import { Separator } from '~/components/ui/separator'
import { api } from '~/utils/api'

export default function SongsPage (): JSX.Element {
  let currentLetter = ''

  const { data: songs, isLoading } = api.songs.getAll.useQuery()

  return (
    <main className='flex w-screen flex-col items-center justify-center'>
      <div className='container flex flex-col gap-12 px-8 py-16'>
        <h1 className='text-4xl'>Músicas</h1>
        {isLoading && <h2>Carregando...</h2>}
        {songs && (
          <ul className='flex flex-col'>
            {songs.map((song) => {
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
                      <p className='text-sm text-muted-foreground'>{song.artist.name}</p>
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
