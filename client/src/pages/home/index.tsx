import { Container } from '@/components/container'
import { useGetDataOverview } from '../../hooks/use-get-dataOverview'
import { Card, CardTitle } from '../../components/ui/card'
import { PieChart } from '@mui/x-charts/PieChart'
import { useEffect, useState } from 'react'
import { CardContent } from '@mui/material'
import { DashboardItem } from './DashboardItem'

export function Home() {
  const { data } = useGetDataOverview()

  const [bookinksByStatus, setBookingsByStatus] = useState([])

  useEffect(() => {
    if (!data) return
    const formattedData = data?.totalBookingsByStatus.map((item, index) => {
      // Definindo as cores para cada status
      let color
      switch (item.status) {
        case 'pendente':
          color = '#fbbf24'
          break
        case 'aprovado':
          color = '#4ade80'
          break
        case 'cancelado':
          color = '#fb7185' // Vermelho
          break
        case 'concluido':
          color = '#38bdf8' // Azul
          break
        default:
          color = 'gray' // Cinza como fallback
      }

      return {
        id: index,
        value: item._count.status, // Valor do count
        label: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitaliza o status
        color: color, // Cor associada ao status
      }
    })
    setBookingsByStatus(formattedData)
  }, [data])

  return (
    <Container className="p-10  flex flex-col ">
      <div className="flex flex-col mx-auto">
        <div className="flex gap-5 ">
          <DashboardItem
            title="Total de agendamentos"
            icon="bookings"
            value={data?.bookings}
          />
          <DashboardItem
            title="Agendamentos recentes"
            icon="recent bookings"
            value={data?.recentBookingsCount}
          />
          <DashboardItem
            title="Usuarios cadastrados"
            icon="user"
            value={data?.totalUsers}
          />
        </div>
        <Card className="mt-10 w-fit">
          <CardContent>
            <CardTitle className="mb-10">Agendamentos por Status</CardTitle>
            <PieChart
              series={[
                {
                  data: bookinksByStatus,
                },
              ]}
              width={400}
              height={200}
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
