import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useAuthStore from '@/store/user-auth.store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IoLogOutOutline } from 'react-icons/io5'

export function Home() {
  const { user, logout } = useAuthStore()

  return (
    <div className="flex">
      <div className="h-screen w-[200px] bg-white border-r-[0.5px] z-50 border-neutral-200 fixed left-0"></div>
      <div className="w-full px-24 h-[80px] flex items-center text-red-300 bg-white fixed z-30 botbrt-b border-[0.5px] border-neutral-200">
        <div className="flex-1 flex items-center justify-end">
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  <IoLogOutOutline className="mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex-1  p-4 absolute top-[200px] left-[200px]">
        <p className="bg-red-400">Conteúdo Principal</p>
        <p onClick={logout}>logout</p>
      </div>
    </div>
  )
}
