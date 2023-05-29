import Link from 'next/link'

import { cn } from '~/lib/utils'

const linkStyle = 'text-sm font-medium transition-colors text-slate-500 hover:text-slate-800'

export function MainNav ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        href="/songs"
        className={linkStyle}
      >
        Músicas
      </Link>
      <Link
        href="/artists"
        className={linkStyle}
      >
        Artistas
      </Link>
      <Link
        href="/about"
        className={linkStyle}
      >
        Sobre
      </Link>
    </nav>
  )
}
