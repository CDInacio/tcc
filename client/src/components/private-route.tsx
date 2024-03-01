import { Navigate, Outlet } from 'react-router-dom'

export function PrivateRoute() {
  const user = localStorage.getItem('user')
  const token = localStorage.getItem('userToken')

  const isAuth = user && token

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
