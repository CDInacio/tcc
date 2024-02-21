import { Navigate, Outlet } from 'react-router-dom'

export function PrivateRoute() {
  const isAuth = true

  return (
    <>
      {isAuth ? (
        <div>
          <header>
            <nav className="bg-red"></nav>
          </header>
          <Outlet />
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  )
}
