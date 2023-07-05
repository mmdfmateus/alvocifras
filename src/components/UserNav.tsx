import { UserPlus, LogOut, Music, type User, Menu, ListMusic, UserSquare2, SunMedium, Moon, Laptop } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { type MouseEvent, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

export interface User {
    id: string,
    name: string,
    email: string,
    image: string,
}

export interface UserNavProps {
    user: User,
}

export function UserNav ({ user }: UserNavProps) {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeSelection = (e: MouseEvent, themeSelected: string) => {
    e.preventDefault()
    setTheme(themeSelected)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} className="relative h-8 w-8 sm:rounded-full">
          <span>
            <Menu strokeWidth='1.5' className='block sm:hidden h-8 w-8' />
          </span>
          <Avatar className="hidden sm:block h-8 w-8">
            <AvatarImage src={`${user.image}`} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="flex font-normal gap-3">
          <Avatar className="block sm:hidden h-8 w-8">
            <AvatarImage src={`${user.image}`} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem className='block sm:hidden focus:bg-inherit'>
          <Tabs defaultValue={theme} className='flex-1'>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value='light' onClick={(e) => handleThemeSelection(e, 'light')}>
                <SunMedium className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value='dark' onClick={(e) => handleThemeSelection(e, 'dark')}>
                <Moon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value='system' onClick={(e) => handleThemeSelection(e, 'system')}>
                <Laptop className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          </DropdownMenuItem>
        <DropdownMenuSeparator className='block sm:hidden' />
        <DropdownMenuGroup className='block sm:hidden'>
          <DropdownMenuItem className='hover:bg-primary-foreground'>
            <Link
              href={'/songs'}
              className='flex items-center'
              onClick={() => setIsOpen(false)}
            >
              <ListMusic className="mr-2 h-4 w-4" />
              <span>Todas as músicas</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='hover:bg-primary-foreground'>
            <Link
              href={'/artists'}
              className='flex items-center'
              onClick={() => setIsOpen(false)}
            >
              <UserSquare2 className="mr-2 h-4 w-4" />
              <span>Todos os artistas</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='hover:bg-primary-foreground'>
            <Link
              href={'/admin/songs'}
              className='flex items-center'
              onClick={() => setIsOpen(false)}
            >
              <Music className="mr-2 h-4 w-4" />
              <span>Cadastrar música</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='hover:bg-primary-foreground'>
            <Link
              href={'/admin/artists'}
              className='flex items-center'
              onClick={() => setIsOpen(false)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Cadastrar artista</span>
            </Link>
          </DropdownMenuItem>

        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer hover:bg-primary-foreground'
          onClick={() => signOut()}
          >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
