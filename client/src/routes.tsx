import { IRoute } from './types/routes.type.ts'
import { Home } from './pages/home'
import { Forms } from './pages/forms/index.tsx'
import { Users } from './pages/users/index.tsx'
import { Clients } from './pages/clients/index.tsx'
import { Bookings } from './pages/bookings/index.tsx'
import { NewBooking } from './pages/bookings/newBooking.tsx'

export const privateRoutes: IRoute[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/formularios',
    element: <Forms />,
  },
  {
    path: '/usuarios',
    element: <Users />,
  },
  {
    path: '/clientes',
    element: <Clients />,
  },
  {
    path: '/agendamentos',
    element: <Bookings />,
  },
  {
    path: '/agendamentos/novo',
    element: <NewBooking />,
  },
]
