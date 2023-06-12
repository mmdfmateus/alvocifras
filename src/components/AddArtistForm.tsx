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
import { zodResolver } from '@hookform/resolvers/zod'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { api } from '~/utils/api'
import { UploadButton } from '@uploadthing/react'

import type { CustomFileRouter } from '~/server/uploadthing'
import Image from 'next/image'

const formSchema = z.object({
  name: z.string().min(4).max(50),
  imageUrl: z.string().url(),
})

export interface AddArtistFormProps {
    setOpen: Dispatch<SetStateAction<boolean>>,
    existingForm?: { id: string} & z.infer<typeof formSchema>
}

const AddArtistForm = ({ setOpen, existingForm }: AddArtistFormProps) => {
  const [imageUploaded, setImageUploaded] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingForm?.name ?? '',
      imageUrl: existingForm?.imageUrl ?? '',
    }
  })

  const { artists: artistsContext } = api.useContext()
  const { mutateAsync: createAsync, isLoading: isCreating } = api.artists.create.useMutation({
    onSuccess (data, variables, context) {
      form.reset()
      setImageUploaded(false)
    }
  })
  const { mutateAsync: editAsync, isLoading: isEditing } = api.artists.edit.useMutation({
    onSuccess (data, variables, context) {
      form.reset()
      setImageUploaded(false)
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const action = existingForm
      ? editAsync({ id: existingForm.id, ...values })
      : createAsync(values)
    await action
    setOpen(false)
    await artistsContext.invalidate()

    setImageUploaded(false)
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6 items-center'>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                            <Input
                                disabled={isCreating || isEditing}
                                placeholder="Sujeito a Reboque"
                                {...field} />
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
                            { (imageUploaded || existingForm?.imageUrl) &&
                                <Image
                                src={form.getValues('imageUrl')}
                                alt='Artista'
                                width={144}
                                height={144}
                                className='h-36 w-36 rounded-md'/>
                                }
                            { (!imageUploaded && !existingForm?.imageUrl) &&
                                <UploadButton<CustomFileRouter>
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                      console.log('Files: ', res)
                                      if (res && res.length > 0) {
                                        form.setValue('imageUrl', res[0]?.fileUrl ?? '')
                                        setImageUploaded(true)
                                      }
                                    }}
                                    onUploadError={(error: Error) => {
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
            <Button isLoading={isCreating || isEditing} className='col-span-2' size={'lg'}>Submit</Button>
        </form>
    </Form>
  )
}

export default AddArtistForm
