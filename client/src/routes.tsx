import { IRoute } from './types/routes.type.ts'
import { Home } from './pages/home'
import { Forms } from './pages/forms/index.tsx'
import { Users } from './pages/users/index.tsx'
import { Clients } from './pages/clients/index.tsx'
import { Bookings } from './pages/bookings/index.tsx'

// export const publicRoutes: IRoute[] = [
//   {
//     path: '/login',
//     element: <Signin />,
//   },
//
//   {
//     path: '/login',
//     element: <Signup />,
//   },
// ]

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
]
