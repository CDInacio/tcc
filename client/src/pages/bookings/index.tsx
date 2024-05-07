/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from '@/components/container'

import { Admin } from './admin'
import { User } from './user'
import useAuthStore from '@/store/user-auth.store'
import { useGetBookings } from '@/hooks/use-get-bookings.hook'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Title } from '@/components/title'
import { Subtitle } from '@/components/subtitle'

interface statusFilter {
  label: string
  value: string
}

const statusFilter: statusFilter[] = [
  {
    label: 'Todos',
    value: 'todos',
  },
  {
    label: 'Pendente',
    value: 'pendente',
  },
  {
    label: 'Autorizado',
    value: 'autorizado',
  },
]

export function Bookings() {
  const { data: bookings } = useGetBookings()
  const { user } = useAuthStore()

  const isAdmin = user?.role === 'ADMIN'

  return (
    <Container className="p-10  flex flex-col items-center">
      <div className="w-[900px]">
        <div className="mb-5">
          {!isAdmin ? (
            <>
              <Title>Meus agendamentos</Title>
            </>
          ) : (
            <div className="flex justify-between items-end">
              <div>
                <Title>Agendamentos</Title>
                <Subtitle>Lista de usuários cadastrados no sistema.</Subtitle>
              </div>
              <div className="flex">
                <Select>
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilter.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-fit ml-3">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilter.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        {!isAdmin ? <User /> : <Admin data={bookings} />}
      </div>
    </Container>
  )
}
