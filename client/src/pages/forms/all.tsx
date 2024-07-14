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

import { Card, CardContent } from '@/components/ui/card'

import {
  IoCloseSharp,
  IoPencil,
  IoRadioButtonOffOutline,
  IoRadioButtonOnOutline,
} from 'react-icons/io5'

import { FormResponse } from '@/types/form.typep'
import { formateDate } from '@/utils/formate-date'
import { useUpdateFormStatus } from '../../hooks/use-update-formstatus'
import { useDeletForm } from '../../hooks/use-delete-form'

export function All() {
  const { data: forms, isError, error } = useGetForms()
  const { mutate: updateStatus } = useUpdateFormStatus()
  const { mutate: deleteForm } = useDeletForm()

  const orderedForms = useMemo(() => {
    return forms?.sort((a: FormResponse, b: FormResponse) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [forms])

  if (isError && error) {
    return <p className="text-gray-300"> {(error as Error).message}</p>
  }

  return (
    <div>
      <Card className="w-[900px]">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Titulo</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Editar/Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedForms?.map((form: FormResponse) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">
                    {!form.isActive ? (
                      <div
                        onClick={() => updateStatus(form.id)}
                        className="flex items-center"
                      >
                        <IoRadioButtonOffOutline className=" text-gray-400 cursor-pointer" />
                        <span className="ml-2 text-gray-400">Inativo</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <IoRadioButtonOnOutline
                          onClick={() => updateStatus(form.id)}
                          className=" text-green-400"
                        />{' '}
                        <span className="ml-2 text-green-400">Ativo</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{form.form_name}</TableCell>
                  <TableCell>{form.user.fullname}</TableCell>
                  <TableCell>
                    {formateDate(form.createdAt, 'dd/mm/yyyy')}
                  </TableCell>
                  <TableCell className="flex items-center  space-x-2">
                    <span className="relative bg-gray-300 p-1 rounded-full cursor-pointer">
                      <IoPencil className="text-gray-500 text-xl" />
                    </span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span className="relative bg-gray-300 p-1 rounded-full cursor-pointer">
                          <IoCloseSharp className="text-gray-500 text-xl" />
                        </span>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Tem certeza disso?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel asChild>
                            <button>Cancelar</button>
                          </AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <button onClick={() => deleteForm(form.id)}>
                              Excluir
                            </button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
