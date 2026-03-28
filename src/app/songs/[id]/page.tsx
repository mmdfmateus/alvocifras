'use client'

import type { JSX } from 'react'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Play, X } from 'lucide-react'
import { ChordLyricsPair, ChordSheetSerializer, HtmlDivFormatter, Song } from 'chordsheetjs'

import { api } from '~/utils/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { buildVideoUrl } from '~/components/AddSongForm'
import { Button } from '~/components/ui/button'

type SongPageProps = {
  params: {
    id: string;
  };
}

const serializer = new ChordSheetSerializer()
const formatter = new HtmlDivFormatter()
const videoHeight = '315'
type SerializedSongArg = Parameters<ChordSheetSerializer['deserialize']>[0]

const parseSong = (chords?: unknown): Song => {
  if (typeof chords !== 'string') {
    return new Song()
  }

  try {
    const parsed = JSON.parse(chords) as SerializedSongArg
    return serializer.deserialize(parsed)
  } catch {
    return new Song()
  }
}

export default function SongDetailPage ({ params }: SongPageProps): JSX.Element {
  const { data: song, isLoading: isLoadingSong } = api.songs.getById.useQuery(params.id)

  const songParsed = isLoadingSong ? new Song() : parseSong(song?.chords)

  const [showVideo, setShowVideo] = useState(false)

  const lyrics = useMemo(() => {
    return songParsed.lines.map((line) =>
      line.items
        .map((item) => {
          if (item instanceof ChordLyricsPair) {
            return item.lyrics
          }

          return ''
        })
        .join('')
    )
  }, [songParsed.lines])

  return (
    <main className='flex w-screen flex-col items-center'>
      {!isLoadingSong && song && (
        <>
          <div className={`sticky ${showVideo ? 'visible' : 'hidden'}`}>
            {song.videoId && (
              <iframe
                width='420'
                height={videoHeight}
                src={buildVideoUrl(song.videoId, 'embed')}
              />
            )}
          </div>
          <div
            className={`container flex max-w-screen-lg flex-col gap-10 px-8 py-16 ${
              showVideo ? 'pt-8' : ''
            }`}
          >
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <Image
                  src={song.artist.imageUrl}
                  alt='artista'
                  height={96}
                  width={96}
                  className='mr-4 h-24 w-24 rounded-full shadow-2xl'
                />
                <div className='flex flex-col'>
                  <h1 className='text-4xl'>{song.name}</h1>
                  <h3 className='text-xl text-muted-foreground'>{song.artist.name}</h3>
                </div>
              </div>
            </div>
            <Tabs defaultValue='chords'>
              <div className='flex items-center gap-6'>
                <TabsList className='ml-6 px-2 py-6'>
                  <TabsTrigger value='chords' className='px-5 py-2'>
                    Cifra
                  </TabsTrigger>
                  <TabsTrigger value='lyrics' className='px-5 py-2'>
                    Letra
                  </TabsTrigger>
                </TabsList>
                {song.videoId && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowVideo((prev) => !prev)}
                  >
                    {showVideo
                      ? <X className='mr-1 h-4 w-4' />
                      : <Play className='mr-2 h-4 w-4' />}
                    <span>{showVideo ? 'Fechar video' : 'Escutar'}</span>
                  </Button>
                )}
              </div>
              <TabsContent value='chords'>
                <div
                  className='ml-2 mt-8'
                  dangerouslySetInnerHTML={{ __html: formatter.format(songParsed) }}
                />
              </TabsContent>
              <TabsContent value='lyrics'>
                <div
                  className='ml-2 mt-8'
                  dangerouslySetInnerHTML={{ __html: lyrics.join('<br>') }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </main>
  )
}
