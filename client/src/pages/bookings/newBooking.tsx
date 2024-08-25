import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatDateToCustomString, formateDate } from '@/utils/formate-date'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ptBR } from 'date-fns/locale'

import { useGetForms } from '../../hooks/use-get-forms.hook'
import { useEffect, useState } from 'react'
import { useCreateBooking } from '../../hooks/use-create-booking'
import { cn } from '../../lib/utils'
import { Container } from '../../components/container'
import { Title } from '../../components/title'
import { Calendar } from '../../components/ui/calendar'
import { Subtitle } from '../../components/subtitle'
import { IoChevronBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useGetAvaliableDates } from '../../hooks/use-get-avaliableDates'
import { Dates, Timeslot } from '../../types/date.type'

interface Form {
  [key: string]: unknown
}

interface FormField {
  id: string
  field_name: string
  field_type: string
  field_required: boolean
  formId: string
}

export function NewBooking() {
  const navigate = useNavigate()
  const { data: form } = useGetForms()
  const [formData, setFormData] = useState<Form>({})
  const [avaliableSlots, setAvaliableSlots] = useState<Timeslot[]>([])
  const { data: dates } = useGetAvaliableDates()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userForm = form?.filter((f: any) => f.isActive === true)[0]
  const {
    mutate: book,
    // isPending: isLoading,
    isError,
    isSuccess,
  } = useCreateBooking()

  const handleBooking = () => {
    const data = {
      formId: userForm.id,
      ...formData,
    }
    book(data)
  }

  useEffect(() => {
    if (isSuccess) {
      setFormData({})
    }
  }, [isSuccess, isError])

  const handleGoBack = () => {
    navigate('/agendamentos')
  }

  useEffect(() => {
    if (formData.date && dates) {
      const formdate = formateDate(formData.date as string, 'yyyy-MM-dd')

      const matchingTimeslots = dates
        .filter((schedule: Dates) => {
          const scheduleDate = formateDate(schedule.date, 'yyyy-MM-dd')
          return scheduleDate === formdate
        })
        .flatMap((schedule: Dates) => schedule.timeslots)

      setAvaliableSlots(matchingTimeslots)
    }
  }, [formData.date, dates])

  return (
    <Container className="p-10  flex flex-col items-center">
      <div className="w-[900px]">
        <div className="">
          <div className="flex  items-center  mb-5 gap-2">
            <div
              className="flex items-center gap-2 cursor-pointer "
              onClick={handleGoBack}
            >
              <IoChevronBack />
              <p>Voltar</p>
            </div>
          </div>
          <Title>Novo agendamento</Title>
          <Subtitle>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequa{' '}
          </Subtitle>
        </div>

        <div className="mt-5 ">
          {userForm?.form_fields.map((item: FormField, i: number) => (
            <div className="my-3" key={item.field_name + i}>
              {item.field_type === 'text' ? (
                <>
                  <Label htmlFor={item.field_type}>{item.field_name}</Label>
                  <span className="text-red-400 ml-1">
                    {item.field_required && '*'}
                  </span>
                  <Input
                    id={item.field_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [item.field_name]: e.target.value,
                      })
                    }
                    key={item.id}
                    type={item.field_type}
                  />
                </>
              ) : item.field_type === 'data' ? (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !formData.date && 'text-muted-foreground'
                        )}
                      >
                        {formData.date ? (
                          formateDate(
                            formData.date as string,
                            'dd/mm/yyyy hh:mm'
                          ) // Add type assertion here
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        className=""
                        locale={ptBR}
                        mode="single"
                        initialFocus
                        selected={formData.date as Date}
                        onSelect={(date) => {
                          setFormData({
                            ...formData,
                            date: date,
                          })
                        }}
                        // modifiers={{
                        //   disabled: occupiedDates.map(
                        //     (date) => new Date(date.date)
                        //   ),
                        // }}
                        modifiersStyles={{
                          disabled: {
                            backgroundColor: 'red',
                            color: 'white',
                          },
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="font-semibold my-3 w-[242px] text-center">
                    {formData.date && avaliableSlots.length > 0
                      ? formatDateToCustomString(
                          (formData.date as Date).toISOString()
                        )
                      : null}
                  </p>
                  {avaliableSlots.length > 0 ? (
                    <div className="flex flex-col flex-wrap gap-2 mt-2">
                      {avaliableSlots.map((slot: Timeslot) => (
                        <Button
                          onClick={() => {
                            if (slot.available) {
                              setFormData({
                                ...formData,
                                time: slot.time,
                              })
                            }
                          }}
                          key={slot._id}
                          variant="outline"
                          className={`w-[242px]
                            ${formData.time === slot.time ? 'bg-primary text-white' : 'text-primary'}
                            ${slot.available === false ? 'text-gray-400 cursor-default hover:bg-white hover:text-gray-400' : 'border-primary hover:bg-primary hover:text-white'}`}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  ) : formData.date && avaliableSlots.length === 0 ? (
                    <p className="">Nenhum horário disponível</p>
                  ) : null}
                </>
              ) : null}
            </div>
          ))}
          <Button onClick={handleBooking}>Agendar</Button>
        </div>
      </div>
    </Container>
  )
}
