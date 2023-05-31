import { type ColumnDef } from '@tanstack/react-table'
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
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Song = {
  id: string
  name: string
  artist: string
  createdAt: Date
  updatedAt: Date
}

export const columns: ColumnDef<Song>[] = [
  {
    accessorKey: 'id',
    header: 'Id'
  },
  {
    accessorKey: 'name',
    header: 'Nome'
  },
  {
    accessorKey: 'artist',
    header: 'Artista'
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em'
  },
  {
    accessorKey: 'updatedAt',
    header: 'Atualizado em'
  },
  {
    id: 'actions',
    cell: () => {
      return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      )
    }
  }
]
