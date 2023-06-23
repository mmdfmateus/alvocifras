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
        <section className="sticky container max-w-screen-lg top-0 flex gap-3 h-16 items-center px-4">
            <Link
                href={'/'}
                >
                <Image
                    src={'/logo.png'}
                    alt='logo'
                    width={40}
                    height={40}
                    />
            </Link>
            <SearchInput className="block sm:hidden"/>
            <MainNav className="mx-6 hidden sm:block" />
            <div className="ml-auto flex items-center sm:space-x-4">
                <SearchInput className="hidden sm:block"/>
                <ThemeToggle />
                { session.status === 'authenticated' &&
                    <UserNav user={session.data.user as User} />
                }
                { session.status === 'unauthenticated' &&
                    <>
                        <span className='w-3'></span>
                        <Button
                            onClick={() => signIn()}
                            >
                            Entrar
                        </Button>
                    </>
                }
            </div>
        </section>
        <div className='sticky h-[1px] w-full border-b z-40 bg-red-500'></div>
    </header>
  )
}
