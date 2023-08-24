import { type ColumnDef } from '@tanstack/react-table'
import { EditSongTableRow, getDateParamFormatted } from '../data-table'
import { buildVideoUrl } from '~/components/AddSongForm'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Song = {
  id: string
  name: string
  artist: { name: string, imageUrl: string }
  videoId: string | null
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
    header: 'Artista',
    cell: ({ row }) => (<div>{row.original.artist.name}</div>),
  },
  {
    accessorKey: 'videoUrl',
    header: 'Video',
    cell: ({ row }) => {
      if (!row.original.videoId) {
        return (<div>-</div>)
      }

      return (<a href={buildVideoUrl(row.original.videoId, 'link')} className='underline font-semibold hover:text-primary' target='_blank'>Youtube</a>)
    }
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
    cell: ({ row }) => EditSongTableRow({ song: { id: row.original.id, name: row.original.name } })
  }
]
