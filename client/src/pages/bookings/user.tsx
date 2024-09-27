import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { useGetUserBookings } from '../../hooks/use-get-user-bookings'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formateDate } from '../../utils/formate-date'
import { Title } from '../../components/title'
import { usePagination } from '../../hooks/use-pagination.hook'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { IoPencilOutline, IoPersonRemoveOutline } from 'react-icons/io5'
import { useUpdateBooking } from '../../hooks/use-update-booking'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { EditBooking } from '../../components/Booking/EditBooking'
import { Separator } from '../../components/ui/separator'

export function User() {
  const navigate = useNavigate()
  const { data: bookings } = useGetUserBookings()
  const { mutate } = useUpdateBooking()

  // Aplicando a paginação
  const { currentPage, setCurrentPage, itens, numbers } = usePagination<
    Record<string, unknown>
  >(
    bookings,
    5 // Mostrando 5 itens por página
  )

  // Estado para controlar qual agendamento/formulário está sendo editado
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  )

  return (
    <div>
      {bookings && bookings.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <Title>Meus agendamentos</Title>
            <Button>
              <Link to="/agendamentos/novo">Novo agendamento</Link>
            </Button>
          </div>
          <Table className="w-[900px] mx-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens?.map((booking: Record<string, unknown>, i) => (
                <TableRow
                  key={i}
                  onClick={() => navigate(`/agendamentos/${booking.id}`)}
                >
                  <TableCell className="font-medium">
                    {formateDate((booking.data as { data: string }).data)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {(booking.data as { hora: string }).hora}
                  </TableCell>
                  <TableCell>
                    {(booking.form as { form_name: string }).form_name}
                  </TableCell>
                  <TableCell className="text-right">
                    {(booking.status as string)
                      .toUpperCase()
                      .charAt(0)
                      .toLocaleUpperCase() +
                      (booking.status as string).slice(1)}
                  </TableCell>
                  <TableCell className="flex">
                    <IoPersonRemoveOutline className="text-gray-500 cursor-pointer mx-5" />

                    <IoPencilOutline className="text-gray-500 cursor-pointer " />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                />
              </PaginationItem>
              {numbers.map((num) => (
                <PaginationItem key={num}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === num}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, numbers.length))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : (
        <div>
          <p>Você ainda não possui agendamentos</p>
          <Button>
            <Link to="/agendamentos/novo">Novo agendamento</Link>
          </Button>
        </div>
      )}
      <Separator />
    </div>
  )
}
