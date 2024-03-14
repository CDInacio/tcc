import { Container } from '@/components/container'
import { useGetAllUsers } from '@/hooks/use-get-all-users.hook'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formateDate } from '@/utils/formate-date'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { usePagination } from '@/hooks/use-pagination.hook'

interface User {
  id: string
  fullname: string
  email: string
  role: string
  createdAt: string
}

export function Users() {
  const { data, isLoading } = useGetAllUsers()

  // recebe um array de tipo genérico e o número de itens por página
  const { currentPage, setCurrentPage, itens, numbers } = usePagination<User>(
    data,
    5
  )
  console.log(numbers)

  return (
    <Container className="flex justify-center ">
      <Card className="w-fit h-fit mt-20">
        <CardContent>
          <Table>
            <TableCaption className="mb-5">
              Lista de usuários cadastrados.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[100px]">Email</TableHead>
                <TableHead>Nível de acesso</TableHead>
                <TableHead className="text-right">Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="w-20 h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-20 h-5" />
                      </TableCell>
                    </TableRow>
                  ))
                : itens?.map((user: User) => (
                    <TableRow key={user.email}>
                      <TableCell className="font-medium">
                        {user.fullname}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.email}
                      </TableCell>
                      <TableCell className="font-medium">{user.role}</TableCell>
                      <TableCell className="font-medium">
                        {formateDate(user.createdAt)}
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
                    setCurrentPage((prev) => {
                      if (prev > 1) return prev - 1
                      return prev
                    })
                  }
                />
              </PaginationItem>
              {numbers.map((number: number) => (
                <PaginationItem key={number}>
                  <PaginationLink
                    isActive={currentPage === number}
                    href="#"
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem> */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => {
                      if (prev < numbers.length) return prev + 1
                      return prev
                    })
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </Container>
  )
}
