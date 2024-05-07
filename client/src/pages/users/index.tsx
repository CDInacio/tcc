import { Container } from '@/components/container'
import { useGetAllUsers } from '@/hooks/use-get-all-users.hook'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formateDate } from '@/utils/formate-date'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { usePagination } from '@/hooks/use-pagination.hook'
import { IoCloseSharp, IoPencil } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { Title } from '@/components/title'
import { Subtitle } from '@/components/subtitle'

interface User {
  id: string
  fullname: string
  email: string
  role: string
  createdAt: string
}

const accessFilter = [
  {
    label: 'Todos',
    value: 'todos',
  },
  {
    label: 'Administrador',
    value: 'admin',
  },
  {
    label: 'Usuário',
    value: 'user',
  },
]

const dateFilter = [
  {
    label: 'Todos',
    value: 'todos',
  },
  {
    label: 'Hoje',
    value: 'hoje',
  },
  {
    label: 'Ontem',
    value: 'ontem',
  },
  {
    label: 'Essa semana',
    value: 'essa-semana',
  },
  {
    label: 'Esse mês',
    value: 'esse-mes',
  },
  {
    label: 'Esse ano',
    value: 'esse-ano',
  },
]

export function Users() {
  const navigate = useNavigate()
  const { data, isLoading } = useGetAllUsers()

  const handleNavigate = (queryParam: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.delete(queryParam)
    currentParams.append(queryParam, value)
    const url = `/usuarios?${currentParams.toString()}`
    navigate(url)
  }

  const getFilteredData = (data: User[]) => {
    const param = new URLSearchParams(window.location.search)
    const usuario = param.get('usuario')
    const periodo = param.get('periodo')

    let filteredData = data

    if (usuario && usuario !== 'todos') {
      filteredData = filteredData?.filter(
        (user) => user.role.toLowerCase() === usuario
      )
    }

    if (periodo && periodo !== 'todos') {
      const currentDate = new Date()
      const today = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      )
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const thisWeek = new Date(today)
      thisWeek.setDate(thisWeek.getDate() - today.getDay())
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const thisYear = new Date(today.getFullYear(), 0, 1)

      switch (periodo) {
        case 'hoje':
          filteredData = filteredData?.filter(
            (user) => new Date(user.createdAt) >= today
          )
          break
        case 'ontem':
          filteredData = filteredData?.filter(
            (user) =>
              new Date(user.createdAt) >= yesterday &&
              new Date(user.createdAt) < today
          )
          break
        case 'essa-semana':
          filteredData = filteredData?.filter(
            (user) => new Date(user.createdAt) >= thisWeek
          )
          break
        case 'esse-mes':
          filteredData = filteredData?.filter(
            (user) => new Date(user.createdAt) >= thisMonth
          )
          break
        case 'esse-ano':
          filteredData = filteredData?.filter(
            (user) => new Date(user.createdAt) >= thisYear
          )
          break
        default:
          break
      }
    }
    return filteredData
  }

  // recebe um array de tipo genérico e o número de itens por página
  const { currentPage, setCurrentPage, itens, numbers } = usePagination<User>(
    getFilteredData(data),
    5
  )

  return (
    <Container className="flex flex-col items-center ">
      <div className="w-[900px] mt-10 mb-5">
        <div className="flex justify-between items-end">
          <div>
            <Title>Usuários</Title>
            <Subtitle>Lista de usuários cadastrados no sistema.</Subtitle>
          </div>
          <div className="flex">
            <Select onValueChange={(value) => handleNavigate('usuario', value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {accessFilter.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleNavigate('periodo', value)}>
              <SelectTrigger className="ml-3">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {dateFilter.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Card className="w-[900px] h-fit ">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[100px]">Email</TableHead>
                <TableHead>Nível de acesso</TableHead>
                <TableHead className="text-right">Criado em</TableHead>
                <TableHead className="text-right">Editar/Excluir</TableHead>
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
                      <TableCell>{user.fullname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{formateDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right flex">
                        <span className="bg-gray-300 p-1 rounded-full cursor-pointer">
                          <IoPencil className="w-4 h-4  rounded-full text-gray-500" />
                        </span>
                        <span className="ml-3 bg-gray-300 p-1 rounded-full cursor-pointer">
                          <IoCloseSharp className="w-4 h-4  rounded-full text-gray-500" />
                        </span>
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
