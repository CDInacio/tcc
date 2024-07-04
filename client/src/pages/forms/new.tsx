import { useReducer, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  IoAddOutline,
  IoRadioButtonOnOutline,
  IoTrashOutline,
} from 'react-icons/io5'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { Switch } from '@/components/ui/switch'

import { toast } from 'sonner'

import { motion, AnimatePresence } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { useCreateForm } from '@/hooks/use-create-form.hook'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const selectItems = [
  {
    name: 'Múltipla escolha',
    value: 'select',
    icon: <IoRadioButtonOnOutline />,
  },
  { name: 'Texto', value: 'text' },
  { name: 'Data', value: 'data' },
  { name: 'Horário', value: 'hour' },
]

interface InputState {
  formName: string
  formDescription: string
  fields: {
    type: string
    text: string
    required: boolean
  }[]
}

type InputAction =
  | { type: 'ADD_INPUT' }
  | { type: 'ADD_DESCRIPTION'; value: string }
  | { type: 'QUESTION_CHANGE'; value: string; index: number }
  | { type: 'SELECT_CHANGE'; value: string; index: number }
  | { type: 'REQUIRED_CHANGE'; index: number }
  | { type: 'REMOVE_INPUT'; index: number }
  | { type: 'UNDO'; value: InputState['fields']; index: number }
  | { type: 'ADD_NAME'; value: string }
  | { type: 'CLEAR_FORM' }

function inputsReducer(state: InputState, action: InputAction): InputState {
  switch (action.type) {
    case 'ADD_INPUT':
      return {
        ...state,
        fields: [...state.fields, { type: '', text: '', required: false }],
      }
    case 'ADD_NAME':
      return { ...state, formName: action.value }
    case 'ADD_DESCRIPTION':
      return { ...state, formDescription: action.value }
    case 'QUESTION_CHANGE':
      return {
        ...state,
        fields: state.fields.map((item, index: number) => {
          if (index === action.index) {
            return { ...item, text: action.value }
          }
          return item
        }),
      }
    case 'SELECT_CHANGE':
      return {
        ...state,
        fields: state.fields.map((item, index: number) => {
          if (index === action.index) {
            return { ...item, type: action.value }
          }
          return item
        }),
      }
    case 'REQUIRED_CHANGE':
      return {
        ...state,
        fields: state.fields.map((item, index: number) => {
          if (index === action.index) {
            return { ...item, required: !item.required }
          }
          return item
        }),
      }
    case 'REMOVE_INPUT':
      return {
        ...state,
        fields: state.fields.filter(
          (_, index: number) => action.index !== index
        ),
      }
    case 'UNDO':
      return action.index !== null ? { ...state, fields: action.value } : state
    case 'CLEAR_FORM':
      return { formName: '', formDescription: '', fields: [] }
    default:
      return state
  }
}

export function New() {
  // Recuperando o estado inicial do localStorage ou setando um estado inicial padrão caso não exista um estado salvo
  // no localStorage ainda (primeira vez que o usuário acessa a página)
  const initialState: InputState = localStorage.getItem('inputs')
    ? JSON.parse(localStorage.getItem('inputs')!)
    : {
        formName: '',
        formDescription: '',
        fields: [{ type: '', text: '', required: false }],
      }

  const { mutate: createForm, isPending: isLoading } = useCreateForm()

  const { toast: t } = useToast()
  const [inputs, dispatch] = useReducer(inputsReducer, initialState)
  const previousStateRef = useRef<InputState['fields']>([])

  const undoIndexRef = useRef<number | null>(null)

  useEffect(() => {
    localStorage.setItem('inputs', JSON.stringify(inputs))
  }, [inputs])

  const handleSelectChange = useCallback(
    (value: string, index: number) => {
      dispatch({ type: 'SELECT_CHANGE', value, index })
    },
    [dispatch]
  )

  const handleQuestionChange = useCallback(
    (value: string, index: number) => {
      dispatch({ type: 'QUESTION_CHANGE', value, index })
    },
    [dispatch]
  )

  const handleAddInput = useCallback(() => {
    dispatch({ type: 'ADD_INPUT' })
  }, [dispatch])

  const handleRequiredChange = useCallback(
    (index: number) => {
      dispatch({ type: 'REQUIRED_CHANGE', index })
    },
    [dispatch]
  )

  const handleRemove = (index: number) => {
    // Salvando o estado antes da remoção
    previousStateRef.current = [...inputs.fields]
    undoIndexRef.current = index

    toast('Campo removido.', {
      description: 'Você removeu um campo do formulário.',
      action: {
        label: 'Desfazer',
        onClick: () => {
          if (undoIndexRef.current !== null) {
            dispatch({
              type: 'UNDO',
              value: previousStateRef.current,
              index: undoIndexRef.current,
            })
            undoIndexRef.current = null
          }
        },
      },
    })

    dispatch({ type: 'REMOVE_INPUT', index })
  }

  const handleCreateForm = async () => {
    if (
      inputs.fields.length >= 1 &&
      (!inputs.fields[0].type || !inputs.fields[0].text)
    ) {
      t({
        variant: 'destructive',
        title: 'Erro!',
        description:
          'Você precisa adicionar pelo menos uma pergunta ao formulário.',
      })
      return
    }

    if (!inputs.formName || !inputs.formDescription) {
      t({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Você precisa preencher todos os campos.',
      })
      return
    }
    createForm(inputs)
    dispatch({ type: 'CLEAR_FORM' })
  }

  return (
    <div className="w-[900px]">
      <div className="flex flex-col">
        <Input
          placeholder="Nome do formulário"
          value={inputs.formName}
          onChange={(e) =>
            dispatch({ type: 'ADD_NAME', value: e.target.value })
          }
        />
        <Textarea
          placeholder="Descrição"
          className="mt-3"
          value={inputs.formDescription}
          onChange={(e) =>
            dispatch({ type: 'ADD_DESCRIPTION', value: e.target.value })
          }
        />
        <Separator className="my-5" />
        <AnimatePresence>
          {inputs?.fields?.map((_, index: number) => (
            <motion.div
              className="flex mb-5"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex-1">
                <Input
                  value={inputs.fields[index].text}
                  placeholder="Pergunta"
                  onChange={(e) => handleQuestionChange(e.target.value, index)}
                />
                <div className="flex items-center mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <IoTrashOutline
                          onClick={() => handleRemove(index)}
                          className="cursor-pointer"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Excluir</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Separator className="h-5 w-[0.7px] mx-2 " />
                  <p className="text-gray-500 text-sm mr-2">
                    Campo obrigatório
                  </p>
                  <Switch
                    checked={inputs.fields[index].required}
                    onCheckedChange={() => handleRequiredChange(index)}
                  />
                </div>
              </div>
              <Select
                onValueChange={(value) => handleSelectChange(value, index)}
                value={inputs.fields[index].type}
              >
                <SelectTrigger className="w-[190px] ml-2">
                  <SelectValue placeholder="Campos" />
                </SelectTrigger>
                <SelectContent className="w-fit">
                  <SelectGroup>
                    {selectItems.map((item) => (
                      <SelectItem
                        value={item.value}
                        key={item.value}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">{item.name}</div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-green-500 hover:bg-green-400"
          onClick={handleCreateForm}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Criar'
          )}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {' '}
              <Button className="ml-2" onClick={handleAddInput}>
                <IoAddOutline className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar campo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
