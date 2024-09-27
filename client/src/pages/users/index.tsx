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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { usePagination } from '@/hooks/use-pagination.hook'
import {
  IoAddOutline,
  IoPencilOutline,
  IoPersonRemoveOutline,
} from 'react-icons/io5'
import { Title } from '@/components/title'
import { Subtitle } from '@/components/subtitle'
import { User } from '../../types/user.type'
import { Button } from '../../components/ui/button'
import { useDeleteUser } from '../../hooks/use-delete-user'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { SignupForm } from '../signup/signup-form'
import { useUpdateUser } from '../../hooks/use-update-user'

export function Users() {
  const { data } = useGetAllUsers()
  const { mutate: deleteUser } = useDeleteUser()
  const { mutate: updateUser } = useUpdateUser()

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

  // Adicionando paginação
  const { currentPage, setCurrentPage, itens, numbers } = usePagination<User>(
    getFilteredData(data),
    5
  )

  // const handleNavigate = (queryParam: string, value: string) => {
  //   const currentParams = new URLSearchParams(window.location.search)
  //   currentParams.delete(queryParam)
  //   currentParams.append(queryParam, value)
  //   const url = `/usuarios?${currentParams.toString()}`
  //   navigate(url)
  // }

  return (
    <Container className="flex flex-col items-center ">
      <div className="w-[900px] mt-10 mb-5">
        <div className="flex justify-between items-end">
          <div>
            <Title>Usuários</Title>
            <Subtitle>Lista de usuários cadastrados no sistema.</Subtitle>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <IoAddOutline className="mr-3 h-6 w-6" />
                Adicionar usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <SignupForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Table className="w-[900px] mx-auto mt-5">
        <TableCaption>A list of your recent users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead> Nome</TableHead>
            <TableHead> Email</TableHead>
            <TableHead> Telefone</TableHead>
            <TableHead> Nível de acesso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {itens?.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium flex items-center gap-3">
                <Avatar>
                  {user?.profileImage ? (
                    <AvatarImage
                      src={user?.profileImage}
                      alt="Profile Image"
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback>
                      {user?.fullname
                        ? user.fullname
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                        : 'NN'}
                    </AvatarFallback>
                  )}
                </Avatar>
                {user.fullname}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell className="flex items-center">
                <Select
                  onValueChange={(value) =>
                    updateUser({ id: user.id, data: { role: value } })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={user.role} />
                  </SelectTrigger>
                  <SelectContent className="w-[100px]">
                    <SelectGroup>
                      {user.role === 'ADMIN' && (
                        <>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ATTENDANT">Atendente</SelectItem>
                          <SelectItem value="COORDINATOR">
                            Coordenador
                          </SelectItem>
                        </>
                      )}

                      {user.role === 'USER' && (
                        <>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="ATTENDANT">Atendente</SelectItem>
                          <SelectItem value="COORDINATOR">
                            Coordenador
                          </SelectItem>
                        </>
                      )}

                      {user.role === 'ATTENDANT' && (
                        <>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="COORDINATOR">
                            Coordenador
                          </SelectItem>
                        </>
                      )}

                      {user.role === 'COORDINATOR' && (
                        <>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ATTENDANT">Atendente</SelectItem>
                        </>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <IoPersonRemoveOutline className="text-gray-500 cursor-pointer mx-5" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tem certeza que deseja deletar essa conta?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteUser(user.id!)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <IoPencilOutline className="text-gray-500 cursor-pointer " />
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
    </Container>
  )
}
