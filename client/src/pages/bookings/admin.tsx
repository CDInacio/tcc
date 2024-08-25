import { Booking } from '@/types/booking'
import { Title } from '../../components/title'
import { useGetBookings } from '../../hooks/use-get-bookings.hook'
import { useMemo } from 'react'
import { BookingCard } from '../../components/Booking/BookingCard'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { useNavigate } from 'react-router-dom'

interface filterT {
  label: string
  value: string
}

const filter: filterT[] = [
  {
    label: 'Todos',
    value: 'todos',
  },
  {
    label: 'Pendente',
    value: 'pendente',
  },
  {
    label: 'Aprovado',
    value: 'aprovado',
  },
  {
    label: 'Cancelado',
    value: 'cancelado',
  },
]

export function Admin() {
  const navigate = useNavigate()
  const { data } = useGetBookings()

  const currentParams = new URLSearchParams(window.location.search)

  // Função para navegar com os filtros
  const handleNavigate = (queryParam: string, value: string) => {
    currentParams.delete(queryParam)
    currentParams.append(queryParam, value)
    const url = `/agendamentos?${currentParams.toString()}`
    navigate(url)
  }

  // Função para filtrar os dados
  const getFilteredData = (data: any) => {
    const cParams = new URLSearchParams(window.location.search)
    const filter = cParams.get('f')

    let filteredData = data

    if (filter && filter !== 'todos') {
      filteredData = filteredData?.filter(
        (booking: Booking) => booking.status === filter
      )
    }

    return filteredData
  }

  // Aplica o filtro e agrupa os bookings por mês
  const bookingsByMonth = useMemo(() => {
    const filteredData = getFilteredData(data)
    return filteredData?.reduce((acc: any, booking: Booking) => {
      const month = new Date(booking.createdAt).toLocaleString('pt-BR', {
        month: 'long',
      })
      if (!acc[month]) {
        acc[month] = []
      }
      acc[month].push(booking)
      return acc
    }, {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentParams])

  return (
    <div className="overflow-hidden">
      <div className="flex justify-between items-end mb-3">
        <div>
          <Title>Agendamentos</Title>
          <Card className="py-2 px-4 mt-3">
            {filter.map((item) => (
              <Button
                onClick={() => handleNavigate('f', item.value)}
                key={item.value}
                className={`mr-2 bg-white  text-gray-600 hover:text-white ${
                  currentParams.get('f') === item.value
                    ? 'bg-primary text-white'
                    : ''
                }`}
              >
                {item.label}
              </Button>
            ))}
          </Card>
        </div>
      </div>

      <div>
        {bookingsByMonth &&
          Object.keys(bookingsByMonth).map((month) => (
            <div key={month}>
              <p className="text-xl font-bold ">
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </p>
              {bookingsByMonth[month].map((booking: Booking) => (
                <BookingCard key={booking.id} bookingData={booking} />
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}
