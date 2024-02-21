import { IRoute } from './types/routes.type.ts'
import { Home } from './pages/home'

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
]
