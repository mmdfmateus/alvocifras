import Image from 'next/image'
import { MainNav } from './MainNav'
import { type User, UserNav } from './UserNav'
import { signIn, useSession } from 'next-auth/react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { SearchInput } from './SearchInput'

export const Header = () => {
  const session = useSession()

  return (
    <header className='sticky'>
      <section className='container sticky top-0 flex h-16 max-w-screen-lg items-center gap-3 px-4'>
        <Link href={'/'}>
          <Image src={'/logo.png'} alt='logo' width={100} height={100} />
        </Link>
        <SearchInput wrapperclassName='block sm:hidden' />
        <MainNav className='mx-6 hidden sm:block' />
        <div className='ml-auto flex items-center gap-2 sm:space-x-4'>
          <SearchInput wrapperclassName='hidden sm:block' />
          <ThemeToggle />
          {session.status === 'authenticated' && (
            <UserNav user={session.data.user as User} />
          )}
          {session.status === 'unauthenticated' && (
            <>
              <Button onClick={() => signIn()}>Entrar</Button>
            </>
          )}
        </div>
      </section>
      <div className='z-40 w-full border-b bg-red-500'></div>
    </header>
  )
}
