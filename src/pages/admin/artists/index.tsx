import { type NextPage } from 'next'
import Head from 'next/head'

import { DataTable } from '~/components/tables/data-table'
import { columns, type Artist } from '~/components/tables/artists/columns'
import { Button } from '~/components/ui/button'
import { UserPlus } from 'lucide-react'

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
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

function getData (): Artist[] {
  // Fetch data from your API here.
  return [
    {
      id: '1',
      name: 'Sujeito a Reboque',
      imageUrl: 'Sujeito a Reboque',
      createdAt: '01/04/2023',
      updatedAt: '01/04/2023'
    }
    // ...
  ]
}

const formSchema = z.object({
  name: z.string().min(4).max(50),
  imageUrl: z.string().url(),
})

const Artists: NextPage = () => {
  const data = getData()
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
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
        <title>Artistas - Alvo Cifras</title>
        <meta name="description" content="Todas as músicas presentes no Alvo Cifras" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="flex w-screen flex-col items-center justify-center">
          <div className="container flex flex-col gap-12 px-8 py-16">
            <div className='flex flex-col gap-4 sm:flex-row items-center justify-between'>
                <h1 className='text-4xl'>Artistas</h1>
                <Dialog modal={false} open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-6 h-4 w-4" strokeWidth='2.5' />
                            <span className='text-md font-semibold'>Cadastrar artista</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="container md:max-w-screen-lg">
                        <DialogHeader>
                            <DialogTitle>Cadastrar artista</DialogTitle>
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
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link da imagem</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://site.com/image.jpeg" {...field} />
                                            </FormControl>
                                            <FormDescription>O link precisa terminar com .jpeg ou .jpg</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
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

export default Artists