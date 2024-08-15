/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from '@/components/container'

import { Admin } from './admin'
import useAuthStore from '@/store/user-auth.store'

import { User } from './user'

export function Bookings() {
  const { user } = useAuthStore()

  const isAdmin = user?.role === 'ADMIN'

  return (
    <Container className="p-10  flex flex-col items-center  overflow-hidden">
      {!isAdmin ? <User /> : <Admin />}
    </Container>
  )
}
