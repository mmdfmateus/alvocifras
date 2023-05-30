import Image from 'next/image'
import { MainNav } from './MainNav'
import { Input } from '~/components/ui/input'
import { type User, UserNav } from './UserNav'
import { signIn, useSession } from 'next-auth/react'
import { Button } from './ui/button'
import Link from 'next/link'

export const Header = () => {
  const session = useSession()

  console.log(session)

  return (
        <header className="sticky top-0 bg-white flex h-16 items-center px-4 border-b">
            <Link
                href={'/'}
                >
                <Image
                    src={'/logo.png'}
                    alt='logo'
                    width={40}
                    height={40}
                    placeholder='blur'
                    />
            </Link>
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
            <div>
                <Input
                    type="search"
                    placeholder="Search..."
                    className="h-9 md:w-40 lg:w-80 focus:outline-none"
                />
            </div>
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
          </header>
  )
}
