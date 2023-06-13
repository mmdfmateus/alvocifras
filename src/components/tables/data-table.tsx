import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { type Artist } from '@prisma/client'
import { api } from '~/utils/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import AddArtistForm from '../AddArtistForm'
import { useState } from 'react'
import AddSongForm from '../AddSongForm'
import { Spinner } from '../Spinner'
// import { Spinner } from '../Spinner'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue> ({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length
            ? (
                table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
                ))
              )
            : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  )
}

export function EditArtistTableRow ({ row }: { row: Artist }) {
  const { mutateAsync } = api.artists.delete.useMutation()
  const { artists: artistsContext } = api.useContext()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            { isDeleting && <Spinner variant='small'/> }
            { !isDeleting && <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                }}
              >
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="container md:max-w-screen-lg">
                <DialogHeader>
                    <DialogTitle>Cadastrar artista</DialogTitle>
                </DialogHeader>
                <AddArtistForm setOpen={setOpen} existingForm={{ id: row.id, name: row.name, imageUrl: row.imageUrl }} />
            </DialogContent>
          </Dialog>

          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className='w-full bg-destructive text-destructive-foreground hover:bg-red-100'
                onSelect={(event) => {
                  event.preventDefault()
                }}
                // asChild
                id='test'
                >
                  {/* <Button size='sm'>Excluir</Button> */}
                  Excluir
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deseja realmente excluir esse artista?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação vai permanentemente remove-lo do banco de dados
                  e não poderá ser desfeita
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting} >Não deletar</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant='destructive'
                    onClick={async () => {
                      setIsDeleting(true)
                      await mutateAsync(row.id)
                      await artistsContext.invalidate()
                    }}
                    disabled={isDeleting}
                    >Deletar</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

export function EditSongTableRow ({ song }: { song: { id: string, name: string } }) {
  const { mutateAsync } = api.songs.delete.useMutation()
  const { data: songData } = api.songs.getById.useQuery(song.id)
  const { songs: songsContext } = api.useContext()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button disabled={isDeleting} variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            { isDeleting && <Spinner variant='small'/> }
            { !isDeleting && <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                }}
              >
                Editar
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="container md:max-w-screen-lg">
                <DialogHeader>
                    <DialogTitle>Cadastrar música</DialogTitle>
                </DialogHeader>
                <AddSongForm setOpen={setOpen} existingForm={{ id: song.id, name: song.name, artistId: songData?.artistId ?? '', chords: songData?.chords?.toString() ?? '' }} />
            </DialogContent>
          </Dialog>

          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className='w-full bg-destructive text-destructive-foreground hover:bg-red-100'
                onSelect={(event) => {
                  event.preventDefault()
                }}
                // asChild
                id='test'
                >
                  {/* <Button size='sm'>Excluir</Button> */}
                  Excluir
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deseja realmente excluir essa música?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação vai permanentemente remover a música <b>{song.name}</b> do banco de dados
                  e não poderá ser desfeita
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting} >Não deletar</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant='destructive'
                    onClick={async () => {
                      setIsDeleting(true)
                      await mutateAsync(song.id)
                      await songsContext.invalidate()
                    }}
                    disabled={isDeleting}
                    >
                      Deletar
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

export function getDateParamFormatted (dateString: string) {
  const date = new Date(dateString)
  const formatted = date.toLocaleDateString('pt-BR')

  return <div>{formatted}</div>
}
