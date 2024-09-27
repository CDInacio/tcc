import { Container } from '@/components/container'
import { IoAddOutline, IoList } from 'react-icons/io5'
import { useQueryParams } from '@/hooks/use-query-param.hook'
import { All } from './all'
import { New } from './new'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Title } from '@/components/title'
import { Subtitle } from '@/components/subtitle'
import { Button } from '../../components/ui/button'

interface MenuItemProps {
  name: string
  icon: JSX.Element
  path: string
}

const menuItems: MenuItemProps[] = [
  {
    name: 'Todos',
    icon: <IoList className="w-5 h-5" />,
    path: '/formularios?q=todos',
  },
]

export function Forms() {
  const query = useQueryParams()
  const queryParam = query.get('q')

  const content: JSX.Element | undefined = useMemo(() => {
    switch (queryParam) {
      case 'todos':
        return <All />
      case 'novo':
        return <New />
      default:
        null
    }
  }, [queryParam])

  return (
    <Container className="p-10  flex flex-col items-center">
      <div>
        <div className="mb-5">
          <Title>Formulários</Title>
          <Subtitle>Lista de formulários cadastrados no sistema.</Subtitle>
        </div>
        <div className="flex items-center justify-between bg-red-5 w-full mb-3">
          <div>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center ${queryParam === item.name.toLowerCase() ? 'text-gray-900 font-semibold' : 'text-gray-400'}
             px-2 py-1.5 rounded cursor-pointer `}
              >
                {item.icon}
                <p className="ml-2">{item.name}</p>
              </Link>
            ))}
          </div>
          <Link to="/formularios?q=novo">
            <Button>
              <IoAddOutline className="mr-3 h-6 w-6" />
              Adicionar formulário
            </Button>
          </Link>
        </div>
        {content}
      </div>
    </Container>
  )
}
