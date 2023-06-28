import { Input } from './ui/input'
import { useState } from 'react'
import { Card } from './ui/card'
import Link from 'next/link'
import { Dot } from 'lucide-react'
import { Separator } from './ui/separator'
import { Skeleton } from './ui/skeleton'
import { cn } from '~/lib/utils'
import { api } from '~/utils/api'
import Image from 'next/image'
import { Label } from './ui/label'
import { useDebouncedValue } from '@mantine/hooks'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  wrapperclassName: string
}

export const SearchInput = (props: InputProps) => {
  const [valueTyped, setValueTyped] = useState('')
  const [searchTerm] = useDebouncedValue(valueTyped, 200)
  const [isOpen, setIsOpen] = useState(false)
  const { data, isLoading, isFetched } = api.search.searchByName.useQuery({ searchTerm }, {
    queryKey: ['search.searchByName', { searchTerm }]
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setValueTyped(value)
    setIsOpen(true)
  }

  const handleBlur = () => {
    setIsOpen(false)
  }

  return (
    <div className={cn('relative z-500 flex-grow p-1', props.wrapperclassName)}>
      <Input
        type='search'
        placeholder="Procure por uma música ou artista"
        className="h-9 md:w-40 lg:w-80 focus:outline-none"
        value={valueTyped}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => setIsOpen(true)}
        {...props}
        />
      { isOpen && (
        <Card className='absolute z-50 min-w-full bg-primary-foreground shadow-md p-3'>
          <h5>Músicas</h5>
          <Separator className='mt-1' />
          { (isLoading || !data) && (
            <div className='flex gap-1 mt-1'>
              <span className='w-5 rounded-lg'/>
              <Skeleton className='h-16 w-full rounded-lg'/>
            </div>
          ) }
          { (isFetched && data?.songs.length === 0) && (
            <div className='h-10 flex items-center justify-center'>
              <Label className='text-muted-foreground'>Nenhuma música encontrada</Label>
            </div>
          )}
          <ul className="w-full mt-2 z-50 rounded-md">
            { data?.songs.map((song) => (
              <Link
                href={`/songs/${song.id}`}
                key={song.id}
                className="mb-2 h-16 z-50 flex items-center p-2 rounded-md hover:bg-primary-foreground last:mb-3"
                >
                  <Dot size={36} />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {song.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {song.artist.name}
                    </p>
                  </div>
              </Link>
            ))}
          </ul>
          <h5>Artistas</h5>
          <Separator className='mt-1' />
          { (isLoading || !data) && (
            <div className='flex gap-3 mt-1'>
              <Skeleton className='w-20 h-16 rounded-full'/>
              <Skeleton className='h-16 w-full rounded-lg'/>
            </div>
          ) }
          { (isFetched && data?.artists.length === 0) && (
            <div className='h-10 flex items-center justify-center'>
              <Label className='text-muted-foreground'>Nenhum artista encontrado</Label>
            </div>
          )}
          <ul className="w-full mt-2 z-50 rounded-md">
            { data?.artists.map((artist) => (
              <Link
                href={`/artists/${artist.id}`}
                key={artist.id}
                className="mb-2 h-16 z-50 flex items-center p-2 rounded-md hover:bg-primary-foreground last:mb-3"
                >
                  <Image
                    src={`${artist.imageUrl}`}
                    alt='artista'
                    height={48}
                    width={48}
                    className='h-12 w-12 rounded-full mr-4'
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {artist.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {artist.name}
                    </p>
                  </div>
              </Link>
            ))}
          </ul>
        </Card>)
      }
    </div>
  )
}
