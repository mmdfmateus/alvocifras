import { Button } from '~/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Textarea } from '~/components/ui/textarea'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { api } from '~/utils/api'
import { ChordSheetSerializer, ChordsOverWordsParser, HtmlTableFormatter, Song, TextFormatter } from 'chordsheetjs'
import { ChordsPreview } from '~/components/chordsViewer/ChordsPreview'
import { Label } from '@radix-ui/react-label'
import { Spinner } from './Spinner'

export interface AddSongFormProps {
    setOpen: Dispatch<SetStateAction<boolean>>,
    existingForm?: { id: string, name: string, artistId: string, chords: string }
}

const parser = new ChordsOverWordsParser()
const tableFormatter = new HtmlTableFormatter()
const textFormatter = new TextFormatter()
const serializer = new ChordSheetSerializer()

const AddSongForm = ({ setOpen, existingForm }: AddSongFormProps) => {
  const [songFinishedParsing, setSongFinishedParsing] = useState(false)
  const { data: artists, isLoading: isLoadingArtists } = api.artists.getAll.useQuery()
  const { data: songData, status } = api.songs.getById.useQuery(existingForm?.id ?? '',
    {
      enabled: !!existingForm,
      onSuccess: function ({ chords }) {
        const songParsed = status === 'success'
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          ? serializer.deserialize(JSON.parse(chords?.toString() ?? ''))
          : new Song()
        setSongFormatted(tableFormatter.format(songParsed))
        setContent(textFormatter.format(songParsed))
        setSongFinishedParsing(true)
      }
    })
  //   console.log(status)

  const { songs: songsContext } = api.useContext()
  const [songFormatted, setSongFormatted] = useState<string>('<div></div>')
  const [song, setSong] = useState<Song | null>(null)
  const [content, setContent] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)

  const { mutateAsync, isLoading: isCreating } = api.songs.create.useMutation({
    onSuccess (data, variables, context) {
      form.reset()
      void songsContext.invalidate()
      setOpen(false)
    }
  })

  const formSchema = z.object({
    name: z.string().min(4, 'Nome precisa ter mais de 4 caracteres').max(50, 'Nome não pode ter mais de 50 caracteres'),
    artistId: z.string({ required_error: 'Escolha um artista' }).nonempty('Escolha um artista'),
    chords: z.string().refine((data) => !isError, { message: 'Cifra inválida' }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: songData?.name ?? '',
      artistId: songData?.artistId ?? '',
      chords: songData?.chords?.toString() ?? '',
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    if (songFormatted.length === 0) {
      form.setError('chords', { message: 'Digite a cifra' })
      return
    }
    await mutateAsync({ ...values, chords: JSON.stringify(serializer.serialize(song!)) })
    form.reset()
  }

  const validateChords = (content: string) => {
    try {
      setIsError(false)

      const song = parser.parse(content)
      setSong(song)
      console.log(JSON.stringify(serializer.serialize(song)))

      setSongFormatted(tableFormatter.format(song))
      //   setIsError(false)
      return true
    } catch (err) {
      console.log(err)
      setIsError(true)
      // setError && setError(true)
      return false
    }
  }

  useEffect(() => {
    validateChords(content)
  }, [content, isError])

  return (
    <Form {...form}>
        { existingForm && status === 'loading' && <div className='w-full h-full flex justify-center items-center'><Spinner /></div> }
        { (!existingForm || status === 'success') && <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                            <Input disabled={isCreating} placeholder="Algo melhor" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="artistId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Artista</FormLabel>
                        { !isLoadingArtists && artists && <Select disabled={isCreating} onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Escolha o artista" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {artists.map((artist) => (
                                    <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>}
                        <FormDescription>
                            Caso não exista o artista desejado, você precisa adiciona-lo primeiro{' '}
                            <Link href="/admin/artists" className='underline hover:text-primary'>aqui</Link>.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="chords"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel >Cifra</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder='Cole aqui a cifra da música'
                                {...field}
                                rows={15}
                                className='max-h-80'
                                onChange={(data) => setContent(data.target.value)}
                                value={content}
                                disabled={isCreating || (existingForm && !songFinishedParsing)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className='h-full'>
                <Label className='text-muted-foreground'>Preview</Label>
                <ChordsPreview
                placeholder='Veja aqui como ficará a cifra e faça os ajustes que desejar'
                label='Preview'
                description='A cifra será salva da maneira que está sendo exibida acima, faça os ajustes necessários'
                songAsHtml={songFormatted}
                isError={isError}
                />
            </div>
            <Button className='col-span-2' isLoading={isCreating} size={'lg'}>Submit</Button>
        </form>}
    </Form>
  )
}

export default AddSongForm
