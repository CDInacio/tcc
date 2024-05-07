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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AdminModalProps {
  open: boolean
  onSetOpen: React.Dispatch<React.SetStateAction<boolean>>
  data: Booking | null
  isEditing: boolean
  onEdit: () => void
}

function AdminModal({
  open,
  onSetOpen,
  data,
  onEdit,
  isEditing,
}: AdminModalProps) {
  const [booking, setBooking] = useState<Booking>({} as Booking)

  useEffect(() => {
    if (data) {
      setBooking(data)
    }
  }, [data])

  function handleChange(value: string) {
    if (isEditing) {
      setBooking((prev) => ({
        ...prev,
        status: value,
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onSetOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do agendamento</DialogTitle>
          <p className="text-gray-700 text-sm">
            {data?.user.fullname}, {formateDate(data?.createdAt)}
          </p>
        </DialogHeader>
        <Separator />
        {/* <p className="mb-3">Dados do formulário</p> */}

        {data?.data ? (
          Object.keys(data.data as Record<string, string>).map((key) => {
            if (key === 'formId') return null
            return (
              <div key={key}>
                <Label htmlFor={key}>{key}</Label>
                <Input
                  readOnly
                  id={key}
                  value={(data.data as Record<string, string>)[key]}
                  name={key}
                />
              </div>
            )
          })
        ) : (
          <p>No data available</p>
        )}
        {isEditing ? (
          <>
            <Label>Status</Label>
            <Select onValueChange={(value: string) => handleChange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    data?.status === 'pending' ? <p>Pendente</p> : ''
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="booked">Agendado</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        ) : (
          <div className="flex items-center text-gray-900 font-bold">
            Status
            <p className="ml-1 text-gray-700 font-normal">
              {data?.status === 'pending' ? <p>Pendente</p> : ''}
            </p>
          </div>
        )}
        <div className="mt-7">
          {isEditing ? (
            <>
              <Button
                onClick={onEdit}
                variant={'ghost'}
                className="text-red-400 hover:bg-transparent hover:text-red-600"
              >
                Cancelar
              </Button>
              <Button className="ml-3 bg-green-400 hover:bg-green-600">
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => onSetOpen(false)}
                variant={'ghost'}
                className="text-red-400 hover:bg-transparent hover:text-red-600"
              >
                Fechar
              </Button>
              <Button onClick={onEdit} className="ml-3 ">
                Editar
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function Admin({ data }: { data: Booking[] }) {
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentBoking, setCurrentBooking] = useState<Booking>()

  const handleDialog = () => {
    setOpen((prev) => !prev)
  }

  function handleEdit() {
    setIsEditing((prev) => !prev)
  }

  useEffect(() => {
    if (!open) {
      setIsEditing(false)
    }
  }, [open])

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
                    handleDialog()
                    setCurrentBooking(item)
                  }}
                >
                  <TableCell>
                    {item.status === 'pending' ? 'Pendente' : ''}
                  </TableCell>
                  <TableCell>{item.user.fullname}</TableCell>
                  <TableCell>
                    {formateDate(item.createdAt, 'dd/mm/yyyy hh:mm')}
                  </TableCell>
                  <TableCell className="text-right flex">
                    <button
                      onClick={handleEdit}
                      className="bg-gray-300 p-1 rounded-full cursor-pointer"
                    >
                      <IoPencil className="w-4 h-4 rounded-full text-gray-500" />
                    </button>
                    <span className="ml-3 bg-gray-300 p-1 rounded-full cursor-pointer">
                      <IoCloseSharp className="w-4 h-4 rounded-full text-gray-500" />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <AdminModal
            onEdit={handleEdit}
            isEditing={isEditing}
            open={open}
            onSetOpen={handleDialog}
            data={currentBoking!}
          />
        </CardContent>
      </Card>
    </>
  )
}
{
  /* <Input
  onChange={handleChange}
  readOnly={!isEditing}
  id={key}
  value={
    !isEditing
      ? (data.data as Record<string, string>)[key]
      : (booking.data as Record<string, string>)[key]
  }
  name={key}
/> */
}
