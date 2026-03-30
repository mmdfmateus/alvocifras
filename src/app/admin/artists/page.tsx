'use client'

import type { JSX } from 'react'
import { useState } from 'react'
import { UserPlus } from 'lucide-react'

import AddArtistForm from '~/components/AddArtistForm'
import { DataTable } from '~/components/tables/data-table'
import { columns } from '~/components/tables/artists/columns'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { api } from '~/utils/api'

export default function AdminArtistsPage (): JSX.Element {
  const [open, setOpen] = useState(false)

  const { data: artists, isLoading } = api.artists.getAll.useQuery()

  return (
    <main className='flex w-screen flex-col items-center justify-center'>
      <div className='container flex flex-col gap-12 px-8 py-16'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <h1 className='text-4xl'>Artistas</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className='mr-6 h-4 w-4' strokeWidth='2.5' />
                <span className='text-md font-semibold'>Cadastrar artista</span>
              </Button>
            </DialogTrigger>
            <DialogContent className='container md:max-w-screen-sm'>
              <DialogHeader>
                <DialogTitle>Cadastrar artista</DialogTitle>
              </DialogHeader>
              <AddArtistForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>
        {isLoading && <h2>Carregando...</h2>}
        {!isLoading && artists && <DataTable columns={columns} data={artists} />}
      </div>
    </main>
  )
}
