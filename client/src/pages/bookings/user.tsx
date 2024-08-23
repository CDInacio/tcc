'use client'

import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { useGetUserBookings } from '../../hooks/use-get-user-bookings'
import { BookingCard } from '../../components/Booking/BookingCard'

export function User() {
  const { data } = useGetUserBookings()

  return (
    <>
      <Button className="mt-10">
        <Link to="/agendamentos/novo">Novo agendamento</Link>
      </Button>
      {data?.map((booking: any) => (
        <BookingCard key={booking.id} bookingData={booking} />
      ))}
    </>
  )
}
