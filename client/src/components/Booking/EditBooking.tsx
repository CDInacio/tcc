import { useState, useEffect } from 'react'
import { Input } from '../ui/input'
import { useGetForm } from '../../hooks/use-get-form'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '../ui/calendar'

interface EditBookingProps {
  fieldData: Record<string, unknown>
  formId: string
  isDialogOpen: boolean // Recebe o estado de abertura/fechamento do dialog
}

export function EditBooking({
  fieldData,
  formId,
  isDialogOpen,
}: EditBookingProps) {
  const [formData, setFormData] = useState(fieldData)
  const { data: form } = useGetForm(formId)
  const [isEditing, setIsEditing] = useState(false)

  // Função para verificar se a string é uma data no formato ISO

  console.log(formId)

  // Limpa o formData quando o dialog for fechado
  useEffect(() => {
    if (!isDialogOpen) {
      setFormData({}) // Limpa o formData ou reseta ao estado inicial
    }
  }, [isDialogOpen, fieldData])

  return (
    <div>
      {Object.keys(formData).map((key, i) => {
        const fieldValue = formData[key] as string
        const isDateField = isISODate(fieldValue)

        return (
          <div key={key}>
            <Label htmlFor={form?.form_fields[i]?.field_name.toLowerCase()}>
              {form?.form_fields[i]?.field_name}
            </Label>
            {isDateField ? (
              <Calendar
                selected={new Date(fieldValue)}
                locale={ptBR}
                mode="single"
                onSelect={(data) =>
                  setFormData({
                    ...formData,
                    [key]: data && data.toISOString(),
                  })
                }
                className="w-full"
              />
            ) : (
              <Input
                id={form?.form_fields[i]?.field_name.toLowerCase()}
                value={
                  formData[key] as
                    | string
                    | number
                    | readonly string[]
                    | undefined
                }
                readOnly={!isEditing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [key]: e.target.value,
                  })
                }
              />
            )}
          </div>
        )
      })}
      <div className="mt-5 flex justify-end gap-3">
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
        <Button onClick={() => setIsEditing(false)}>Salvar</Button>
      </div>
    </div>
  )
}
