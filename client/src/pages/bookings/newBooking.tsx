import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formateDate } from '@/utils/formate-date'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { oc, ptBR } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { useGetForms } from '../../hooks/use-get-forms.hook'
import { useEffect, useState } from 'react'
import { Form } from '../../types/form.typep'
import { Schedule, Slot } from '../../types/Slot.typep'
import { useGetAvaliableDates } from '../../hooks/use-get-hours'
import { useCreateBooking } from '../../hooks/use-create-booking'
import { cn } from '../../lib/utils'
import { Container } from '../../components/container'
import { Title } from '../../components/title'
import { Calendar } from '../../components/ui/calendar'

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
  const { data: form } = useGetForms()
  const [formData, setFormData] = useState<Form>({})
  // const [occupiedDates, setOccupiedDates] = useState<Schedule[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: dates } = useGetAvaliableDates()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userForm = form?.filter((f: any) => f.isActive === true)[0]
  const { mutate: book, isPending: isLoading } = useCreateBooking()

  const handleBooking = () => {
    const data = {
      formId: userForm.id,
      ...formData,
    }
    book(data)
    setDialogOpen(false)
  }

  useEffect(() => {
    const slots: Slot[] = []

    dates?.map((date) => {
      if (date.date === formateDate(formData.date as string)) {
        for (const slot of date.slot) {
          if (slot.status === 'livre') {
            slots.push(slot)
          }
        }
      }
    })
    console.log(slots)
  }, [dates, formData.date])

  return (
    <Container className="p-10  flex flex-col items-center">
      <div className="w-[900px]">
        <Title>Novo agendamento</Title>
        <Button className="mt-10">
          <Link to="/agendamentos">Voltar</Link>
        </Button>

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
                        formateDate(formData.date as string, 'dd/mm/yyyy hh:mm') // Add type assertion here
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
                      selected={formData.date as Date | undefined}
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
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
