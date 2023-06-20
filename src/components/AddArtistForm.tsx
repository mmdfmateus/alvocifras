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
import { type Dispatch, type SetStateAction, useState, useTransition } from 'react'
import { api } from '~/utils/api'
import { generateReactHelpers } from '@uploadthing/react/hooks'

import type { CustomFileRouter } from '~/server/uploadthing'
import Image from 'next/image'
import { FileDialog, FileWithPreview } from './FileDialog'
import toast from 'react-hot-toast'

const formSchema = z.object({
  name: z.string().min(4).max(50),
  image: z.unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")
    .optional(),
})

export interface AddArtistFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>,
  existingForm?: { id: string} & z.infer<typeof formSchema>
}

const { useUploadThing } = generateReactHelpers<CustomFileRouter>()

const AddArtistForm = ({ setOpen, existingForm }: AddArtistFormProps) => {
  const [imageUploaded, setImageUploaded] = useState(false)
  const [files, setFiles] = useState<FileWithPreview[] | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: existingForm?.name ?? '',
      image: existingForm?.image ?? '',
    }
  })

  // uploadthing
  const { isUploading, startUpload } = useUploadThing({
    endpoint: 'imageUploader'
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

    console.log(values)

    startTransition(async () => {
      try {

        // Upload images if data.images is an array of files
        const image = await toast
          .promise(startUpload(values.image as File[]), {
            loading: "Salvando imagem",
            success: "Imagem salva com sucesso",
            error: "Algum erro ocorreu ao salvar a imagem",
          })
          .then((res) => {
            console.log(res)
            const formattedImages = res?.map((image) => ({
              id: image.fileKey,
              name: image.fileKey.split("_")[1] ?? image.fileKey,
              url: image.fileUrl,
            })) ?? []

            return formattedImages[0] ?? null
          })

        console.log(image)

        const action = existingForm
          ? editAsync({ id: existingForm.id, name: values.name, imageUrl: image?.url! })
          : createAsync({ name: values.name, imageUrl: image?.url! })
        await action
        setOpen(false)
        await artistsContext.invalidate()
        
        setImageUploaded(false)

        toast.success("Artista adicionado com sucesso")

        // Reset form and files
        form.reset()
        setFiles(null)
      } catch (error) {
        error instanceof Error
          ? toast.error(error.message)
          : toast.error("Algum erro ocorreu ao salvar o artista")
      }
    })

    
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-7'>
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
                name="image"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Imagem</FormLabel>
                        <FormControl>
                            <div className='flex items-center justify-center'>
                              { (!imageUploaded && !existingForm?.image) &&
                                  <FileDialog
                                    setValue={form.setValue}
                                    name='image'
                                    maxFiles={1}
                                    maxSize={1024 * 1024 * 4}
                                    files={files}
                                    setFiles={setFiles}
                                    isUploading={isUploading}
                                    disabled={isPending}
                                  />
                              }
                            </div>
                        </FormControl>
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
