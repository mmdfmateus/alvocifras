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
import { useState } from 'react'
import { api } from '~/utils/api'
import AddArtistForm from '~/components/AddArtistForm'

const Artists: NextPage = () => {
  const [open, setOpen] = useState(false)

  const { data: artists, isLoading } = api.artists.getAll.useQuery()

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
                    <DialogContent className="container md:max-w-screen-sm">
                        <DialogHeader>
                            <DialogTitle>Cadastrar artista</DialogTitle>
                        </DialogHeader>
                        <AddArtistForm setOpen={setOpen} />
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
