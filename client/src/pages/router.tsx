import { Signin } from './signin'
import { Signup } from './signup'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from '../components/private-route.tsx'
import { privateRoutes } from '../routes.tsx'
import { IRoute } from '../types/routes.type.ts'

export function Router() {
  const userData = true

  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        {privateRoutes.map((route: IRoute, i: number) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route
        path="/login"
        element={userData ? <Navigate to="/" /> : <Signin />}
      />
      <Route path="/cadastro" element={<Signup />} />
    </Routes>
  )
}
