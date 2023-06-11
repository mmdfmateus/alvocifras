import { type NextPage } from 'next'
import Head from 'next/head'

import { DataTable } from '~/components/tables/data-table'
import { columns } from '~/components/tables/artists/columns'
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
import { api } from '~/utils/api'
import { UploadButton } from '@uploadthing/react'

import type { CustomFileRouter } from '~/server/uploadthing'
import Image from 'next/image'

const formSchema = z.object({
  name: z.string().min(4).max(50),
  imageUrl: z.string().url(),
})

const Artists: NextPage = () => {
  const [open, setOpen] = useState(false)
  const [imageUploaded, setImageUploaded] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    }
  })

  const { data: artists, isLoading } = api.artists.getAll.useQuery()
  const { artists: artistsContext } = api.useContext()
  const { mutateAsync } = api.artists.create.useMutation({
    onSuccess (data, variables, context) {
      form.reset()
      setImageUploaded(false)
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    await mutateAsync(values)
    await artistsContext.invalidate()

    setOpen(false)
    setImageUploaded(false)
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
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
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
                            <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6 items-center'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Sujeito a Reboque" {...field} />
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
                                              <div className='flex items-center justify-center'>
                                                {/* <Input placeholder="https://site.com/image.jpeg" {...field} /> */}
                                                { imageUploaded &&
                                                  <Image
                                                    src={form.getValues('imageUrl')}
                                                    alt='Artista'
                                                    width={144}
                                                    height={144}
                                                    className='h-36 w-36 rounded-md'/>
                                                  }
                                                { !imageUploaded &&
                                                  <UploadButton<CustomFileRouter>
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(res) => {
                                                      // Do something with the response
                                                      console.log('Files: ', res)
                                                      if (res && res.length > 0) {
                                                        form.setValue('imageUrl', res[0]?.fileUrl ?? '')
                                                        setImageUploaded(true)
                                                      }
                                                      // alert('Upload Completed')
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                      // Do something with the error.
                                                      setImageUploaded(false)
                                                      alert(`ERROR! ${error.message}`)
                                                    }}
                                                    />
                                                  }
                                              </div>
                                            </FormControl>
                                            <FormDescription>O link precisa terminar com .jpeg ou .jpg</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className='col-span-2' size={'lg'}>Submit</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            { isLoading && <h2>Carregando...</h2> }
            {!isLoading && artists && <DataTable columns={columns} data={artists} />}
          </div>
        </main>
    </>
  )
}

export default Artists
