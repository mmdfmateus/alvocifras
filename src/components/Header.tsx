import Image from 'next/image'
import { MainNav } from './MainNav'
import { Input } from '~/components/ui/input'
import { type User, UserNav } from './UserNav'
import { signIn, useSession } from 'next-auth/react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export const Header = () => {
  const session = useSession()

  console.log(session)

  return (
    <header className='sticky'>
        <section className="sticky container max-w-screen-lg top-0 bg-primary-foreground flex h-16 items-center px-4">
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
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
            <div>
                <Input
                    type="search"
                    placeholder="Procure por uma música..."
                    className="h-9 md:w-40 lg:w-80 focus:outline-none"
                    />
            </div>
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
