'use client'

import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { useGetUserBookings } from '../../hooks/use-get-user-bookings'

export function User() {
  const { data } = useGetUserBookings()

  return (
    <>
      <Button className="mt-10">
        <Link to="/agendamentos/novo">Novo agendamento</Link>
      </Button>
      <p>ola</p>
    </>
  )
}
