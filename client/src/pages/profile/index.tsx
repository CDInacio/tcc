import {
  IoCheckmarkCircleOutline,
  IoCheckmarkOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
} from 'react-icons/io5'
import { Container } from '../../components/container'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import { useGetUser } from '../../hooks/use-get-user'
import { useGetUserBookings } from '../../hooks/use-get-user-bookings'
import { formatDateToCustomString } from '../../utils/formate-date'

export function Profile() {
  const { data: user } = useGetUser()
  const { data: bookings } = useGetUserBookings()

  return (
    <Container className="p-10  flex flex-col ">
      <div className="flex gap-10">
        <Card className="text-center overflow-hidden min-h-[500px] pb-6 w-[500px]">
          <img
            src={user?.profileImage}
            className="w-full h-[250px] object-cover "
          />
          <CardHeader>
            <CardTitle className="text-start">Meu perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <p>{user?.fullname}</p>
              <p>{user?.phoneNumber}</p>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between">
              <p>{user?.email}</p>
            </div>
            <Separator className="my-3" />
          </CardContent>
          <Button className="">Editar informações</Button>
        </Card>
        {user?.role === 'USER' && (
          <Card className="max-h-[500px] overflow-y-scroll w-[600px]">
            <CardHeader>
              <CardTitle>Meus agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Separator className="my-3" />
              <div>
                {bookings?.map(
                  (data: {
                    id: string
                    form: { form_name: string }
                    data: { date: string }
                    status: string
                  }) => (
                    <div
                      key={data.id}
                      className="my-3 flex justify-between hover:bg-gray-100 p-3 transition duration-300 cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{data.form.form_name}</p>
                        <p className="text-gray-500">
                          {formatDateToCustomString(data.data.date)}
                        </p>
                      </div>
                      <div>
                        {data.status === 'pendente' ? (
                          <div className="flex items-center gap-1 ">
                            <IoTimeOutline className="text-yellow-500" />
                            <p>Pendente</p>
                          </div>
                        ) : data.status === 'cancelado' ? (
                          <div className="flex items-center gap-1">
                            <IoCloseCircleOutline className="text-red-500" />
                            <p>Cancelado</p>
                          </div>
                        ) : data.status === 'aprovado' ? (
                          <div className="flex items-center gap-1">
                            <IoCheckmarkCircleOutline className="text-green-500" />
                            <p>Aprovado</p>
                          </div>
                        ) : data.status === 'concluido' ? (
                          <div className="flex items-center gap-1">
                            <IoCheckmarkOutline className="text-sky-500" />
                            <p>Concluido</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  )
}
