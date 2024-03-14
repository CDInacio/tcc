import { useReducer, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  IoAddOutline,
  IoRadioButtonOnOutline,
  IoTextOutline,
  IoCalendarNumberOutline,
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
  { name: 'Texto', value: 'text', icon: <IoTextOutline /> },
  { name: 'Data', value: 'data', icon: <IoCalendarNumberOutline /> },
]

interface InputState {
  type: string
  text: string
  required: boolean
}

type InputAction =
  | { type: 'SELECT_CHANGE'; value: string; index: number }
  | { type: 'QUESTION_CHANGE'; value: string; index: number }
  | { type: 'ADD_INPUT' }
  | { type: 'ADD'; value: InputState }
  | { type: 'READ_INPUT'; value: InputState }
  | { type: 'REQUIRED_CHANGE'; index: number }
  | { type: 'REMOVE_INPUT'; index: number }
  | { type: 'UNDO'; value: InputState[]; index: number }
  | { type: 'CLEAR' }

function inputsReducer(state: InputState[], action: InputAction): InputState[] {
  switch (action.type) {
    case 'SELECT_CHANGE':
      return state.map((input, index: number) =>
        index === action.index ? { ...input, type: action.value } : input
      )
    case 'QUESTION_CHANGE':
      return state.map((input, index: number) =>
        index === action.index ? { ...input, text: action.value } : input
      )
    case 'REQUIRED_CHANGE':
      return state.map((input, index: number) =>
        index === action.index ? { ...input, required: !input.required } : input
      )
    case 'REMOVE_INPUT':
      return state.filter((_, index: number) => index !== action.index)
    case 'READ_INPUT':
      return [...state, action.value]
    case 'ADD_INPUT':
      return [...state, { type: '', text: '', required: false }]
    case 'ADD':
      return [...state, action.value]
    case 'UNDO':
      return action.index !== null ? action.value : state
    case 'CLEAR':
      return [{ type: '', text: '', required: false }]
    default:
      return state
  }
}

export function New() {
  // Recuperando o estado inicial do localStorage ou setando um estado inicial padrão caso não exista um estado salvo
  // no localStorage ainda (primeira vez que o usuário acessa a página)
  const initialState: InputState[] = localStorage.getItem('inputs')
    ? JSON.parse(localStorage.getItem('inputs')!)
    : [{ type: '', text: '', required: false }]

  const { mutate: createForm, isLoading } = useCreateForm()
  const { toast: t } = useToast()
  const [inputs, dispatch] = useReducer(inputsReducer, initialState)
  const previousStateRef = useRef<InputState[]>([])
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
    previousStateRef.current = [...inputs]
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
    if (inputs.length >= 1 && (!inputs[0].type || !inputs[0].text)) {
      t({
        variant: 'destructive',
        title: 'Erro!',
        description:
          'Você precisa adicionar pelo menos uma pergunta ao formulário.',
      })
      return
    }
    createForm(inputs)
    dispatch({ type: 'CLEAR' })
  }

  return (
    <div className="w-[600px] mt-10">
      <div className="flex flex-col">
        <AnimatePresence>
          {inputs.map((_, index: number) => (
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
                  value={inputs[index].text}
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
                    checked={inputs[index].required}
                    onCheckedChange={() => handleRequiredChange(index)}
                  />
                </div>
              </div>
              <Select
                onValueChange={(value) => handleSelectChange(value, index)}
                value={inputs[index].type}
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
        <Button className="ml-2" onClick={handleAddInput}>
          <IoAddOutline className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
