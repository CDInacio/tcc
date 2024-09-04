/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoEllipsisHorizontalCircleSharp,
  IoPencil,
  IoTime,
} from 'react-icons/io5'
import { getDayOfWeekAndNumber } from '../../utils/formate-date'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Card } from '../ui/card'
import { Booking } from '../../types/booking'
import { useUpdateBookingStatus } from '../../hooks/use-update-bookingStatus'

interface BookingCardProps {
  bookingData: Booking
}

export function BookingCard({ bookingData }: BookingCardProps) {
  const { mutate: updateStatus } = useUpdateBookingStatus()

  return (
    <>
      <Card className="py-4 px-6 my-3  w-[900px]  hover:bg-gray-100 transition-all duration-300">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <p className="font-medium">
                {getDayOfWeekAndNumber((bookingData.data as any)?.date).day}
              </p>
              <p className="text-4xl font-semibold text-gray-700">
                {getDayOfWeekAndNumber((bookingData.data as any)?.date).number}
              </p>
            </div>
            <Separator orientation="vertical" className="h-14 mx-6" />
            <div>
              <div className="flex items-center gap-1">
                <IoTime className="text-gray-500" />
                <p>9:00</p>
              </div>
              <div>
                {bookingData.status === 'pending' ? (
                  <div className="flex items-center gap-1 ">
                    <IoEllipsisHorizontalCircleSharp className="text-yellow-400" />
                    <p>Pendente</p>
                  </div>
                ) : bookingData.status === 'cancelado' ? (
                  <div className="flex items-center gap-1">
                    <IoCloseCircle className="text-red-400" />
                    <p>Cancelado</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <IoCheckmarkCircle className="text-green-400" />
                    <p>Aprovado</p>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-[70px] flex flex-col items-start">
              <p className="text-gray-800 font-[600]">
                {bookingData?.user?.fullname}
              </p>
              <Avatar className="mt-2">
                <AvatarImage
                  className="h-7 w-7 rounded-full object-cover"
                  src={bookingData?.user?.profileImage}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <Select
            onValueChange={(value) =>
              updateStatus({
                id: bookingData.id,
                status: value,
                userId: bookingData.user.id!,
                role: bookingData.user.role,
              })
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Editar" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="edit" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <IoPencil className="text-gray-500" />
                    <p>Alterar detalhes</p>
                  </div>
                </SelectItem>
                <Separator />
                <SelectItem value="aprovado" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <IoCheckmarkCircle className="text-gray-500" />
                    <p>Aprovar</p>
                  </div>
                </SelectItem>
                <SelectItem value="cancelado" className="cursor-pointer">
                  <div
                    className="flex items-center gap-2"
                    onClick={() =>
                      updateStatus({
                        id: bookingData.id,
                        status: 'cancelar',
                        userId: bookingData.user.id!,
                        role: bookingData.user.role,
                      })
                    }
                  >
                    <IoCloseCircle className="text-gray-500" />
                    <p>Cancelar</p>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </>
  )
}
