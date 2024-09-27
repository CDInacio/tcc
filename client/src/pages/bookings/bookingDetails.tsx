import { useNavigate, useParams } from 'react-router-dom'
import { Container } from '../../components/container'
import { Title } from '../../components/title'
import { useGetBooking } from '../../hooks/use-get-booking'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useState, useEffect } from 'react'
import { IoChevronBack, IoPencilOutline, IoTrashOutline } from 'react-icons/io5'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function BookingDetails() {
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const { data } = useGetBooking(id!)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }

    if (data?.data) {
      setFormData(data.data)
    }
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSave = () => {
    console.log('Save data', formData)
    // send to server...
    setIsEditing(false)
  }

  const handleGoBack = () => {
    navigate('/agendamentos')
  }

  function isISODate(date: string) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/
    return isoDateRegex.test(date)
  }

  return (
    <Container className="p-10 flex flex-col items-center">
      <div className="w-[900px]">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="mb-10">
              <div className="flex justify-between">
                <div className="flex w-full  justify-between text-gray-600">
                  <div
                    className="flex  items-center cursor-pointer mb-5 gap-2"
                    onClick={handleGoBack}
                  >
                    <IoChevronBack />
                    <p>Voltar</p>
                  </div>
                  <div className="flex gap-5">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer">
                            <IoPencilOutline
                              className="h-5 w-5"
                              onClick={() => setIsEditing(true)}
                            />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer">
                            <IoTrashOutline className="h-5 w-5" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excluir</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              <Title>Detalhes do agendamento</Title>
            </div>
            {formData ? (
              Object.keys(formData as Record<string, string>).map((key) => {
                if (key === 'formId') return null
                return (
                  <div key={key}>
                    <Label htmlFor={key}>{key}</Label>
                    <Input
                      className={`${isEditing ? 'border-[1px] border-blue-300' : 'border border-gray-300'} w-full mb-4`}
                      readOnly={!isEditing}
                      id={key}
                      value={
                        isISODate(formData[key])
                          ? new Date(formData[key]).toLocaleDateString()
                          : formData[key]
                      }
                      name={key}
                      onChange={handleChange}
                    />
                  </div>
                )
              })
            ) : (
              <p>No data available</p>
            )}
            {isEditing ? (
              <div className="mt-3 flex gap-3">
                <Button onClick={handleSave}>Salvar alterações</Button>
                <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
              </div>
            ) : (
              <div className="mt-3 flex gap-3">
                {' '}
                {/* <Button onClick={() => setIsEditing(true)}>Editar</Button> */}
                {/* <Button onClick={() => setIsEditing(true)}>Excluir</Button> */}
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  )
}
