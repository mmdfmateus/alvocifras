import { type ReactNode } from 'react'

export const metadata = {
  title: 'Músicas - Alvo Cifras',
  description: 'Todos as músicas presentes no Alvo Cifras'
}

type SongsLayoutProps = {
  children: ReactNode;
}

export default function SongsLayout ({ children }: SongsLayoutProps) {
  return children
}
