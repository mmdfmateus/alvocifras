import { type ReactNode } from 'react'

export const metadata = {
  title: 'Artistas - Alvo Cifras',
  description: 'Todos os artistas presentes no Alvo Cifras'
}

type ArtistsLayoutProps = {
  children: ReactNode;
}

export default function ArtistsLayout ({ children }: ArtistsLayoutProps) {
  return children
}
