'use client'

import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { useGetUserBookings } from '../../hooks/use-get-user-bookings'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formateDate } from '../../utils/formate-date'

export function User() {
  const { data } = useGetUserBookings()

  return (
    <>
      <Button className="mt-10">
        <Link to="/agendamentos/novo">Novo agendamento</Link>
      </Button>
      <Card className="w-[900px] mt-5">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item: any) => (
                <TableRow key={item.id} className="cursor-pointer">
                  <TableCell
                    className={`font-semibold ${item.status ? 'text-red-400 ' : 'text-green-400'}`}
                  >
                    {item.status === 'pending' ? 'Pendente' : ''}
                  </TableCell>
                  <TableCell>
                    {formateDate(item.createdAt, 'dd/mm/yyyy hh:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
