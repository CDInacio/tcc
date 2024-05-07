import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCreateBooking } from '@/hooks/use-create-booking'
import { useGetForms } from '@/hooks/use-get-forms.hook'
import { cn } from '@/lib/utils'
import { formateDate } from '@/utils/formate-date'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ptBR } from 'date-fns/locale'

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

export function User() {
  const [formData, setFormData] = useState<Form>({})
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: form } = useGetForms()
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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Button className="mt-10">Agendar</Button>
      </DialogTrigger>
      <DialogContent className="w-[700px]">
        <DialogHeader>
          <DialogTitle>{userForm?.form_name}</DialogTitle>
          <DialogDescription>{userForm?.form_description}</DialogDescription>
        </DialogHeader>
        <div className="mt-5">
          {userForm?.form_fields.map((item: FormField, i: number) => (
            <div className="my-3" key={item.field_name + i}>
              {item.field_type === 'text' || item.field_type === 'hour' ? (
                <>
                  <Label htmlFor={item.field_type}>{item.field_name}</Label>
                  <span className="text-red-400 ml-1">
                    {item.field_required && '*'}
                  </span>
                  <Input
                    className={`${item.field_type === 'hour' && 'w-40'}`}
                    id={item.field_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [item.field_name]: e.target.value,
                      })
                    }
                    key={item.id}
                    type={item.field_type}
                    placeholder={item.field_type === 'hour' ? 'Ex: 12:00' : ''}
                  />
                </>
              ) : item.field_type === 'date' ? (
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
                      locale={ptBR}
                      mode="single"
                      selected={formData.date as Date | undefined}
                      onSelect={(date) => {
                        setFormData({
                          ...formData,
                          date: date,
                        })
                      }}
                      // disabled={(date) =>
                      //   date > new Date() || date < new Date('1900-01-01')
                      // }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : null}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleBooking} className="mt-5">
            Agendar
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}{' '}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
