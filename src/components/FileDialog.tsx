import * as React from 'react'
import Image from 'next/image'
// import type { FileWithPreview } from '~/types'
// import type { FileWithPath } from 'react-dropzone'
import Cropper, { type ReactCropperElement } from 'react-cropper'
import {
  useDropzone,
  type Accept,
  type FileRejection,
  type FileWithPath,
} from 'react-dropzone'
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from 'react-hook-form'
import { toast } from 'react-hot-toast'

import 'cropperjs/dist/cropper.css'

import { cn, formatBytes } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Icons } from './Icons'
export type FileWithPreview = FileWithPath & {
    preview: string
  }

interface FileDialogProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLDivElement> {
  name: Path<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  accept?: Accept
  maxSize?: number
  maxFiles?: number
  files: FileWithPreview[] | null
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>
  isUploading?: boolean
  disabled?: boolean
}

export function FileDialog<TFieldValues extends FieldValues> ({
  name,
  setValue,
  accept = {
    'image/*': [],
  },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  files,
  setFiles,
  isUploading = false,
  disabled = false,
  className,
  ...props
}: FileDialogProps<TFieldValues>) {
  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      setValue(
        name,
        acceptedFiles as PathValue<TFieldValues, Path<TFieldValues>>,
        {
          shouldValidate: true,
        }
      )

      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === 'file-too-large') {
            toast.error(
              `Imagem muito grande, o tamanho máximo é ${formatBytes(maxSize)}`
            )
            return
          }
          errors[0]?.message && toast.error(errors[0].message)
        })
      }
    },

    [maxSize, name, setFiles, setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
    disabled,
  })

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      { !(files?.length) && 
        <div
          {...getRootProps()}
          className={cn(
            'group relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
            'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            isDragActive && 'border-muted-foreground/50',
            disabled && 'pointer-events-none opacity-60',
            className
            )}
            {...props}
            >
          <input {...getInputProps()} />
          {isUploading
            ? (
              <div className="group grid w-full place-items-center gap-1 sm:px-10">
                <Icons.upload
                  className="h-9 w-9 animate-pulse text-muted-foreground"
                  aria-hidden="true"
                  />
              </div>
              )
              : isDragActive
              ? (
                <div className="grid place-items-center gap-2 text-muted-foreground sm:px-5">
                  <Icons.upload
                    className={cn('h-8 w-8', isDragActive && 'animate-bounce')}
                    aria-hidden="true"
                    />
                  <p className="text-base font-medium">Solte a imagem aqui</p>
                </div>
                )
                : 
                (
                <div className="grid place-items-center gap-1 sm:px-5">
                  <Icons.upload
                    className="h-8 w-8 text-muted-foreground"
                    aria-hidden="true"
                    />
                  <p className="mt-2 text-base font-medium text-muted-foreground">
                    Arraste e solte a imagem aqui, ou clique para selecionar dos seus arquivos
                  </p>
                  <p className="text-sm text-slate-500">
                    Adicione arquivos menores que {formatBytes(maxSize)}
                  </p>
                </div>
                )
            }
      <p className="text-center text-sm font-medium text-muted-foreground">
        O tamanho máximo do arquivo é {maxFiles} {maxFiles === 1 ? 'file' : 'files'}
      </p>
        </div> 
      }
      {files?.length
        ? (
          <div className="grid gap-5">
          {files?.map((file, i) => (
            <FileCard
              key={i}
              i={i}
              name={name}
              setValue={setValue}
              files={files}
              setFiles={setFiles}
              file={file}
            />
            ))}
        </div>
          )
          : null}
    </div>
  )
}

interface FileCardProps<TFieldValues extends FieldValues> {
  i: number
  file: FileWithPreview
  name: Path<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  files: FileWithPreview[] | null
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>
}

function FileCard<TFieldValues extends FieldValues> ({
  i,
  file,
  name,
  setValue,
  files,
  setFiles,
}: FileCardProps<TFieldValues>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [cropData, setCropData] = React.useState<string | null>(null)
  const cropperRef = React.useRef<ReactCropperElement>(null)

  // Crop image
  const onCrop = React.useCallback(() => {
    if (!files || !cropperRef.current) return
    setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL())

    cropperRef.current?.cropper.getCroppedCanvas().toBlob((blob) => {
      if (!blob) return
      const croppedImage = new File([blob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      })
      files.splice(i, 1, croppedImage as FileWithPreview)
      setValue(name, files as PathValue<TFieldValues, Path<TFieldValues>>)
    })
  }, [file.name, file.type, files, i, name, setValue])

  // Crop image on enter key press
  React.useEffect(() => {
    function handleKeydown (e: KeyboardEvent) {
      if (e.key === 'Enter') {
        onCrop()
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [onCrop])

  return (
    <div className="relative flex flex-col items-center justify-between gap-2.5">
        <Image
          src={cropData || file.preview}
          alt={file.name}
          className="h-48 w-48 shrink-0 rounded-md"
          width={256}
          height={256}
          loading="lazy"
        />
      <div className="flex items-center gap-2 align-center">
        <div className="flex flex-col justify-center">
          <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
            {file.name}
          </p>
          <p className="text-xs text-slate-500">
            {(file.size / 1024 / 1024).toFixed(2)}MB
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {file.type.startsWith('image') && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
              >
                <Icons.crop className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Editar imagem</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <p className="absolute left-5 top-4 text-base font-medium text-muted-foreground">
                Editar imagem
              </p>
              <div className="mt-8 grid place-items-center space-y-5">
                <Cropper
                  ref={cropperRef}
                  className="h-[450px] w-[450px] object-cover"
                  zoomTo={0.5}
                  initialAspectRatio={1 / 1}
                  preview=".img-preview"
                  src={file.preview}
                  viewMode={1}
                  aspectRatio={1 / 1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  guides={true}
                />
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    aria-label="Crop image"
                    type="button"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      onCrop()
                      setIsOpen(false)
                    }}
                  >
                    <Icons.crop
                      className="mr-2 h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Editar imagem
                  </Button>
                  <Button
                    aria-label="Reset crop"
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      cropperRef.current?.cropper.reset()
                      setCropData(null)
                    }}
                  >
                    <Icons.reset
                      className="mr-2 h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Cancelar edição
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => {
            if (!files) return
            setFiles(files.filter((_, j) => j !== i))
            setValue(
              name,
              files.filter((_, j) => j !== i) as PathValue<
                TFieldValues,
                Path<TFieldValues>
              >,
              {
                shouldValidate: true,
              }
            )
          }}
        >
          <Icons.close className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Remover</span>
        </Button>
      </div>
    </div>
  )
}
