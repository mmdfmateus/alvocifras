import { type NextPage } from 'next'
import Head from 'next/head'

import { DataTable } from '~/components/tables/data-table'
import { type Song, columns } from '~/components/tables/songs/columns'
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
import { TextareaWithDescription } from '~/components/TextAreaWithDescription'
import { useState } from 'react'

function getData (): Song[] {
  // Fetch data from your API here.
  return [
    {
      id: '1',
      name: 'Algo Melhor',
      artist: 'Sujeito a Reboque',
      createdAt: '01/04/2023',
      updatedAt: '01/04/2023'
    }
    // ...
  ]
}

const artistIds = [
  {
    id: '1',
    name: 'Sujeito a Reboque'
  },
  {
    id: '2',
    name: 'Flávio Barboni'
  }
]

const formSchema = z.object({
  name: z.string().min(4).max(50),
  artistId: z.string().nonempty(),
  chords: z.string().nonempty(),
})

const Songs: NextPage = () => {
  const data = getData()
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistId: '1',
      name: '',
      chords: '',
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    setOpen(false)
  }

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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {artistIds.map((artist) => (
                                                        <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                            <FormLabel>Cifra</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                  placeholder='Cole aqui a cifra da música'
                                                  {...field}
                                                  rows={15}
                                                   />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <TextareaWithDescription
                                  placeholder='Veja aqui como ficará a cifra e faça os ajustes que desejar'
                                  rows={15}
                                  disabled
                                  label='Preview'
                                  description='A cifra será salva da maneira que está sendo exibida acima, faça os ajustes necessários'
                                  />
                                <Button className='col-span-2' type='submit' size={'lg'}>Submit</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable columns={columns} data={data} />
          </div>
        </main>
    </>
  )
}

export default Songs
