'use client'

import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { useGetUserBookings } from '../../hooks/use-get-user-bookings'
import { BookingCard } from '../../components/Booking/BookingCard'
import { useEffect } from 'react'
import { privateRequest } from '../../utils/api'

export function User() {
  const { data } = useGetUserBookings()

  useEffect(() => {
    const fetchData = async () => {
      const data = await privateRequest.get('/users/avaliableDates')
      console.log(data.data)
    }
    fetchData()
    console.log('first')
  }, [])

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
