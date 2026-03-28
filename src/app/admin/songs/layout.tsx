import { type ReactNode } from 'react'

export const metadata = {
  title: 'Admin - Músicas - Alvo Cifras',
  description: 'Gerencie músicas no Alvo Cifras'
}

type AdminSongsLayoutProps = {
  children: ReactNode;
}

export default function AdminSongsLayout ({ children }: AdminSongsLayoutProps) {
  return children
}
