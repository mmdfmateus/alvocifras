import Image from 'next/image';
import { MainNav } from './MainNav';
import { Input } from '~/components/ui/input';
import { User, UserNav } from './UserNav';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';

export const Header = () => {
    const session = useSession();

    console.log(session);

    return (
        <div className="flex h-16 items-center px-4 border-b border-b-orange-950">
            <Image 
                src={'/logo.png'}
                alt='logo'
                width={40}
                height={40}
            />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
            <div>
                <Input
                    type="search"
                    placeholder="Search..."
                    className="h-9 md:w-[100px] lg:w-[300px] focus:outline-none"
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
                        className="text-sm font-medium transition-colors text-slate-500 hover:text-slate-900"
                        >
                        Entrar
                    </Button>
                </>
            }
            </div>
          </div>
    );

}