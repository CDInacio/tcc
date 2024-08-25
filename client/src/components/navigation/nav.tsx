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
import {
  IoNotificationsOutline,
  IoChevronDownOutline,
  IoCheckmarkCircle,
} from 'react-icons/io5'
import { Separator } from '../ui/separator'
import { useGetNotifications } from '../../hooks/use-get-user-notifications'
import { useReadNotification } from '../../hooks/use-read-notification'
import { formatRelativeDate } from '../../utils/formate-date'
import { Notification } from '../../types/notification.type'
// import { useToast } from '@/components/ui/use-toast'

export function Nav() {
  const { mutate: readNotification } = useReadNotification()
  const { user, logout } = useAuthStore()
  const { data: notifications } = useGetNotifications()
  // const { toast } = useToast()

  let notificationsLen = 0

  if (notifications) {
    notificationsLen = notifications?.filter(
      (item: Notification) => item.read === false
    ).length
  }

  const handleReadNotification = () => {
    if (notificationsLen === 0) return
    readNotification()
  }

  // useEffect(() => {
  //   if (notificationsLen > 0) {
  //     toast({
  //       title: 'Olá, você possui uma nova notificação!',
  //       description: 'Friday, February 10, 2023 at 5:57 PM',
  //       action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
  //     })
  //   }
  // }, [notifications])

  return (
    <div className="w-full px-24 h-[80px] flex items-center  bg-white fixed z-30 shadow-sm">
      <div className="flex-1 flex items-center justify-end">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="relative">
                  <IoNotificationsOutline className="w-6 h-6" />
                  {notificationsLen > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      {notificationsLen}
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-[400px]">
                <div className="flex items-center justify-between ">
                  <p className="text-base leading-7 [&:not(:first-child)]:mt-6 font-bold">
                    Notificações
                  </p>
                  <p
                    onClick={handleReadNotification}
                    className="text-blue-400 font-bold cursor-pointer"
                  >
                    Marcar como lidas
                  </p>
                </div>
                <Separator className="w-full my-1" />
                {notifications?.map((item: Notification) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-all duration-300 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2">
                      {item.type === 'success' ? (
                        <IoCheckmarkCircle className="text-green-400 w-5 h-5" />
                      ) : item.type === 'error' ? (
                        <IoCheckmarkCircle />
                      ) : null}
                      <div className=" flex flex-col gap-y-1">
                        <h5 className="font-bold text-gray-800">
                          {item.message}
                        </h5>
                        <p className="text-gray-700">{item.description}</p>
                        <span className="text-gray-400">
                          {formatRelativeDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
