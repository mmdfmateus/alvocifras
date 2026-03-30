import { type ReactNode } from 'react'

export const metadata = {
  title: 'Artista - Alvo Cifras',
  description: 'Aprenda as cifras de artistas no Alvo Cifras'
}

type ArtistDetailLayoutProps = {
  children: ReactNode;
}

export default function ArtistDetailLayout ({ children }: ArtistDetailLayoutProps) {
  return children
}
