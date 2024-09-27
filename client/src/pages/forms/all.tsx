import { useMemo } from 'react'
import { useGetForms } from '@/hooks/use-get-forms.hook'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { IoCloseSharp, IoPencil } from 'react-icons/io5'

import { FormResponse } from '@/types/form.typep'
import { formateDate } from '@/utils/formate-date'
import { useUpdateFormStatus } from '../../hooks/use-update-formstatus'
import { useDeleteForm } from '../../hooks/use-delete-form'
import { usePagination } from '../../hooks/use-pagination.hook'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export function All() {
  const { data: forms, isError, error } = useGetForms()
  const { mutate: updateStatus } = useUpdateFormStatus()
  const { mutate: deleteForm } = useDeleteForm()

  const orderedForms = useMemo(() => {
    return forms?.sort((a: FormResponse, b: FormResponse) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [forms])

  const { currentPage, setCurrentPage, itens, numbers } =
    usePagination<FormResponse>(
      orderedForms,
      5 // 5 itens por página
    )

  if (isError && error) {
    return <p className="text-gray-300"> {(error as Error).message}</p>
  }

  return (
    <div>
      <div className="w-[900px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titulo</TableHead>
              <TableHead>Criado por</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens?.map((form: FormResponse) => (
              <TableRow key={form.id}>
                <TableCell>{form.form_name}</TableCell>
                <TableCell>{form.user.fullname}</TableCell>
                <TableCell>
                  {formateDate(form.createdAt, 'dd/mm/yyyy')}
                </TableCell>
                <TableCell className="font-medium flex gap-5">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="airplane-mode"
                      className="text-red-400"
                      checked={form.isActive}
                      onCheckedChange={() =>
                        updateStatus({
                          id: form.id,
                          isActive: form.isActive ? false : true,
                        })
                      }
                    />
                    <Label htmlFor="airplane-mode">
                      {form.isActive ? 'Ativado' : 'Desativado'}
                    </Label>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-5">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        {/* Envolvendo o ícone em uma span para evitar o erro */}
                        <span>
                          <IoCloseSharp className="text-gray-500 cursor-pointer" />
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Tem certeza que deseja excluir?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteForm(form.id)}
                          >
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <IoPencil className="text-gray-500 cursor-pointer" />
                  </div>
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
