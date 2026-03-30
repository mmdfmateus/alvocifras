import { type ReactNode } from 'react'

export const metadata = {
  title: 'Admin - Artistas - Alvo Cifras',
  description: 'Gerencie os artistas do Alvo Cifras'
}

type AdminArtistsLayoutProps = {
  children: ReactNode;
}

export default function AdminArtistsLayout ({ children }: AdminArtistsLayoutProps) {
  return children
}
