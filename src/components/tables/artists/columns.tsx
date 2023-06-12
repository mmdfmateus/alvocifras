import { type ColumnDef } from '@tanstack/react-table'
import { EditArtistTableRow, getDateParamFormatted } from '../data-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Artist = {
  id: string
  name: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export const columns: ColumnDef<Artist>[] = [
  {
    accessorKey: 'id',
    header: 'Id'
  },
  {
    accessorKey: 'name',
    header: 'Nome'
  },
  {
    accessorKey: 'imageUrl',
    header: 'Imagem'
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
    cell: ({ row }) => getDateParamFormatted(row.getValue('createdAt')),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Atualizado em',
    cell: ({ row }) => getDateParamFormatted(row.getValue('updatedAt')),
  },
  {
    id: 'actions',
    cell: ({ row }) => EditArtistTableRow({ row: row.original })
  }
]
