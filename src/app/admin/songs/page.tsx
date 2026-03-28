'use client'

import type { JSX } from 'react'
import { useState } from 'react'
import { Music } from 'lucide-react'

import AddSongForm from '~/components/AddSongForm'
import { DataTable } from '~/components/tables/data-table'
import { columns } from '~/components/tables/songs/columns'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { api } from '~/utils/api'

export default function AdminSongsPage (): JSX.Element {
  const [open, setOpen] = useState(false)

  const { data: songs, isLoading: isLoadingSongs } = api.songs.getAll.useQuery()

  return (
    <main className='flex w-screen flex-col items-center justify-center'>
      <div className='container flex flex-col gap-12 px-8 py-16'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <h1 className='text-4xl'>Músicas</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger id='trigger'>
              <Button>
                <Music className='mr-6 h-4 w-4' strokeWidth='2.5' />
                <span className='text-md font-semibold'>Cadastrar música</span>
              </Button>
            </DialogTrigger>
            <DialogContent className='container max-h-screen overflow-x-scroll overflow-y-auto md:max-w-screen-lg'>
              <DialogHeader>
                <DialogTitle>Cadastrar música</DialogTitle>
              </DialogHeader>
              <AddSongForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>
        {isLoadingSongs && <h2>Carregando...</h2>}
        {!isLoadingSongs && songs && <DataTable columns={columns} data={songs} />}
      </div>
    </main>
  )
}
