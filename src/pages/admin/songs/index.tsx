import { type NextPage } from 'next'
import Head from 'next/head'

import { DataTable } from '~/components/tables/data-table'
import { columns } from '~/components/tables/songs/columns'
import { Button } from '~/components/ui/button'
import { Music } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
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
import { useEffect, useState } from 'react'
import { api } from '~/utils/api'
import { ChordsOverWordsParser, HtmlTableFormatter } from 'chordsheetjs'
import { ChordsPreview } from '~/components/chordsViewer/ChordsPreview'
import { Label } from '@radix-ui/react-label'

const Songs: NextPage = () => {
  const [open, setOpen] = useState(false)

  const { data: songs, isLoading: isLoadingSongs } = api.songs.getAll.useQuery()
  const { data: artists, isLoading: isLoadingArtists } = api.artists.getAll.useQuery()
  const { songs: songsContext } = api.useContext()
  const { mutateAsync } = api.songs.create.useMutation({
    onSuccess (data, variables, context) {
      void songsContext.invalidate()
      setOpen(false)
      form.reset()
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
      name: '',
      artistId: 'Selecione o artista',
      chords: '',
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    await mutateAsync({ ...values, chords: song })
  }

  const [song, setSong] = useState<string>('<div></div>')
  const [content, setContent] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)

  const validateChords = (content: string) => {
    try {
      setIsError(false)
      const parser = new ChordsOverWordsParser()
      const formatter = new HtmlTableFormatter()
      const song = parser.parse(content)

      setSong(formatter.format(song))
      setIsError(false)
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
    <>
      <Head>
        <title>Músicas - Alvo Cifras</title>
        <meta name="description" content="Todos as músicas presentes no Alvo Cifras" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="flex w-screen flex-col items-center justify-center">
          <div className="container flex flex-col gap-12 px-8 py-16">
            <div className='flex flex-col gap-4 sm:flex-row items-center justify-between'>
                <h1 className='text-4xl'>Músicas</h1>
                <Dialog modal={false} open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Music className="mr-6 h-4 w-4" strokeWidth='2.5' />
                            <span className='text-md font-semibold'>Cadastrar música</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="container md:max-w-screen-lg">
                        <DialogHeader>
                            <DialogTitle>Cadastrar música</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Algo melhor" {...field} />
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
                                            { !isLoadingArtists && artists && <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                    songAsHtml={song}
                                    isError={isError}
                                    />
                                </div>
                                <Button className='col-span-2' type='submit' size={'lg'}>Submit</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            { isLoadingSongs && <h2>Carregando...</h2> }
            {!isLoadingSongs && songs && <DataTable columns={columns} data={songs} />}
          </div>
        </main>
    </>
  )
}

export default Songs
