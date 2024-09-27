import { Booking } from '@/types/booking'
import { Title } from '../../components/title'
import { useGetBookings } from '../../hooks/use-get-bookings.hook'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formateDate } from '../../utils/formate-date'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { useUpdateBookingStatus } from '../../hooks/use-update-bookingStatus'
// import { useNavigate } from 'react-router-dom'
import { usePagination } from '../../hooks/use-pagination.hook'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export function Admin() {
  // const navigate = useNavigate()
  const { data: bookings } = useGetBookings()
  const { mutate: updateStatus } = useUpdateBookingStatus()

  // const currentParams = new URLSearchParams(window.location.search)

  // const handleNavigate = (queryParam: string, value: string) => {
  //   currentParams.delete(queryParam)
  //   currentParams.append(queryParam, value)
  //   const url = `/agendamentos?${currentParams.toString()}`
  //   navigate(url)
  // }

  const getFilteredData = (data: Booking[]) => {
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

  const { currentPage, setCurrentPage, itens, numbers } =
    usePagination<Booking>(
      getFilteredData(bookings),
      7 // Mostrando 8 itens por página
    )

  return (
    <div className="overflow-hidden">
      <div className="flex justify-between items-end mb-3">
        <Title>Agendamentos</Title>
      </div>
      <div>
        <Table className="w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead className="w-[100px]">Hora</TableHead>
              <TableHead>Agendado por</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Feito em</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens?.map((booking: Booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {formateDate((booking.data as { date: string }).date)}
                </TableCell>
                <TableCell className="font-medium">
                  {(booking.data as { time: string }).time}
                </TableCell>
                <TableCell className="flex items-center gap-3">
                  <Avatar>
                    {' '}
                    {booking?.user?.profileImage ? (
                      <AvatarImage
                        src={booking?.user?.profileImage}
                        alt="Profile Image"
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback>
                        {booking?.user?.fullname
                          ? booking?.user.fullname
                              .split(' ')
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                          : 'NN'}{' '}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {booking?.user?.fullname}
                </TableCell>
                <TableCell>{booking?.user?.phoneNumber}</TableCell>
                <TableCell>{formateDate(booking?.createdAt)}</TableCell>
                <TableCell className="">
                  <Select
                    onValueChange={(value) =>
                      updateStatus({
                        id: booking.id,
                        status: value,
                        userId: booking.user.id!,
                        role: booking.user.role,
                        date: (booking.data as { date: string }).date,
                        time: (booking.data as { time: string }).time,
                      })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue
                        placeholder={
                          booking?.status?.charAt(0).toUpperCase() +
                          booking?.status?.slice(1).toLowerCase()
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="aprovado">Aprovar</SelectItem>
                        <SelectItem value="cancelado">Cancelar</SelectItem>
                        <SelectItem value="concluido">Concluir</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
    </div>
  )
}
