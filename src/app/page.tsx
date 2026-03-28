'use client'

import type { JSX } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { HomeCard } from '~/components/HomeCard'
import { api } from '~/utils/api'

export default function HomePage (): JSX.Element {
  const { data: songs } = api.songs.getAll.useQuery({ take: 3, includeArtist: true })
  const { data: artists } = api.artists.getAll.useQuery({ take: 3 })

  return (
    <main className='flex w-screen flex-col items-center justify-center'>
      <div className='container flex flex-col items-center justify-center gap-12 px-4 py-16 md:flex-row'>
        <HomeCard title='Músicas' buttonTitle='Ver todas' buttonRedirectTo='/songs'>
          {(songs ?? []).map((song, index) => (
            <Link
              href={`/songs/${song.id}`}
              key={index}
              className='mb-4 flex h-16 items-center rounded-md p-2 last:mb-0 hover:bg-primary-foreground'
            >
              <Image
                src={`${song.artist.imageUrl}`}
                alt='artista'
                height={48}
                width={48}
                className='mr-4 h-12 w-12 rounded-full'
              />
              <div className='space-y-1'>
                <p className='text-sm font-semibold leading-none'>{song.name}</p>
                <p className='text-sm text-muted-foreground'>{song.artist.name}</p>
              </div>
            </Link>
          ))}
        </HomeCard>

        <HomeCard title='Artistas' buttonTitle='Ver todos' buttonRedirectTo='/artists'>
          {(artists ?? []).map((artist, index) => (
            <Link
              href={`/artists/${artist.id}`}
              key={index}
              className='mb-4 flex h-16 items-center rounded-md p-2 last:mb-0 hover:bg-primary-foreground'
            >
              <Image
                src={`${artist.imageUrl}`}
                alt='artista'
                height={48}
                width={48}
                className='mr-4 h-12 w-12 rounded-full'
              />
              <div className='flex items-center space-y-1'>
                <p className='text-sm font-semibold leading-none'>{artist.name}</p>
              </div>
            </Link>
          ))}
        </HomeCard>
      </div>
    </main>
  )
}
