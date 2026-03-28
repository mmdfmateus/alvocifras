import { type ReactNode } from 'react'

export const metadata = {
  title: 'Música - Alvo Cifras',
  description: 'Aprenda a cifra da música aqui no Alvo Cifras'
}

type SongDetailLayoutProps = {
  children: ReactNode;
}

export default function SongDetailLayout ({ children }: SongDetailLayoutProps) {
  return children
}
