import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import useAuthStore from '@/store/user-auth.store'
import { IoNotificationsOutline, IoChevronDownOutline } from 'react-icons/io5'
import { Separator } from '../ui/separator'
export function Nav() {
  const { user, logout } = useAuthStore()

  const handleClick = () => {
    console.log('click')
  }

  return (
    <div className="w-full px-24 h-[80px] flex items-center  bg-white fixed z-30 shadow-sm">
      <div className="flex-1 flex items-center justify-end">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="relative" onClick={handleClick}>
                  <IoNotificationsOutline className="w-6 h-6" />
                  <span className="absolute top-[-2px] right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>x Notificações</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator className="h-[60px] mx-5" orientation="vertical" />

          <div className="flex flex-col items-end leading-5">
            <p className="mr-3 font-bold">{user?.name}</p>
            <p className="mr-3 text-gray-500">{user?.email}</p>
          </div>
          <Separator className="w-[20px]" orientation="vertical" />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IoChevronDownOutline className="w-5 h-5 ml-3 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
