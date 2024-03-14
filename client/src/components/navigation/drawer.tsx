import {
  IoDocumentTextOutline,
  IoPersonCircleOutline,
  IoPersonOutline,
  IoCalendarClearOutline,
  IoLogOutOutline,
} from 'react-icons/io5'
import { Separator } from '../ui/separator'
import { NavLink } from 'react-router-dom'
import { Skeleton } from '../ui/skeleton'
import useAuthStore from '@/store/user-auth.store'

interface DrawerItemProps {
  name: string
  icon: JSX.Element
  path: string
}

const drawerItems: DrawerItemProps[] = [
  {
    name: 'Formulários',
    icon: <IoDocumentTextOutline className="w-5 h-5" />,
    path: '/formularios?q=todos',
  },
  {
    name: 'Agendamentos',
    icon: <IoCalendarClearOutline className="w-5 h-5" />,
    path: '/agendamentos',
  },
  {
    name: 'Usuários',
    icon: <IoPersonCircleOutline className="w-5 h-5" />,
    path: '/usuarios',
  },
  {
    name: 'Clientes',
    icon: <IoPersonOutline className="w-5 h-5" />,
    path: '/clientes',
  },
]

const renderDrawerItem = (item: DrawerItemProps, isAdmin: boolean) => {
  const adminActions = ['Usuários', 'Formulários', 'Clientes']
  if (adminActions.includes(item.name) && !isAdmin) return null

  return (
    <div
      className="hover:bg-gray-100 transition-colors my-3  rounded cursor-pointer focus:bg-accent 
  focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      <NavLink
        to={item.path}
        style={({ isActive }) => ({
          backgroundColor: isActive ? '#F3F4F6' : 'transparent',
          color: isActive ? '#111827' : '#9ca3af',
          // fontWeight: isActive ? '550' : '400',
        })}
        className={'flex items-center px-2 py-1.5'}
      >
        {item.icon}
        <p className="ml-2 ">{item.name}</p>
      </NavLink>
    </div>
  )
}

export const Drawer = () => {
  const { logout, user } = useAuthStore()

  return (
    <div className="h-screen p-5 w-[250px] bg-white shadow-sm fixed left-0">
      <div className="flex flex-col justify-between  h-full my-[100px]">
        <div>
          {drawerItems.map((item) =>
            renderDrawerItem(item, user?.role === 'ADMIN')
          )}
        </div>
      </div>
    </div>
  )
}
