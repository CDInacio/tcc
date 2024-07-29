import { Card, CardContent } from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Booking } from '@/types/booking'
import { formateDate } from '@/utils/formate-date'
import { IoCloseSharp, IoPencil } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

export function Admin({ data }: { data: Booking[] }) {
  const navigate = useNavigate()

  const handleNavigation = (id: string) => {
    navigate(`/agendamentos/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/agendamentos/${id}?edit=true`)
  }

  return (
    <>
      <Card className="w-[900px]">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Requerente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Editar/Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item: Booking) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => {
                    handleNavigation(item.id)
                  }}
                >
                  <TableCell
                    className={`font-semibold ${item.status ? 'text-red-400 ' : 'text-green-400'}`}
                  >
                    {item.status === 'pending' ? 'Pendente' : ''}
                  </TableCell>
                  <TableCell>{item.user.fullname}</TableCell>
                  <TableCell>
                    {formateDate(item.createdAt, 'dd/mm/yyyy hh:mm')}
                  </TableCell>
                  <TableCell className="text-right flex">
                    <button className="bg-gray-300 p-1 rounded-full cursor-pointer">
                      <IoPencil
                        onClick={() => handleEdit(item.id)}
                        className="w-4 h-4 rounded-full text-gray-500 z-50"
                      />
                    </button>
                    <span className="ml-3 bg-gray-300 p-1 rounded-full cursor-pointer">
                      <IoCloseSharp className="w-4 h-4 rounded-full text-gray-500" />
                    </span>
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
