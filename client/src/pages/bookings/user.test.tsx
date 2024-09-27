/* eslint-disable no-extra-semi */
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { User } from './user'
import { useGetUserBookings } from '../../hooks/use-get-user-bookings'
import { usePagination } from '../../hooks/use-pagination.hook'

// Mock the hooks
jest.mock('../../hooks/use-get-user-bookings')
jest.mock('../../hooks/use-pagination.hook')

describe('User Component', () => {
  const mockBookings = [
    {
      data: { date: '07/09/2024', time: '10:00' },
      form: { form_name: 'Form 1' },
      status: 'Concluido',
    },
    {
      data: { date: '09/07/2024', time: '11:00' },
      form: { form_name: 'Form 2' },
      status: 'Pendente',
    },
  ]

  beforeEach(() => {
    ;(useGetUserBookings as jest.Mock).mockReturnValue({
      data: mockBookings,
      isLoading: false,
      isError: false,
    })
    ;(usePagination as jest.Mock).mockReturnValue({
      currentPage: 1,
      setCurrentPage: jest.fn(),
      itens: mockBookings,
      numbers: [1],
    })
  })

  test('renders User component', () => {
    render(
      <Router>
        <User />
      </Router>
    )
    expect(screen.getByText('Meus agendamentos')).toBeInTheDocument()
  })

  test('displays bookings when data is available', () => {
    render(
      <Router>
        <User />
      </Router>
    )
    expect(screen.getByText('07/09/2024')).toBeInTheDocument()
    expect(screen.getByText('10:00')).toBeInTheDocument()
    expect(screen.getByText('Form 1')).toBeInTheDocument()
    expect(screen.getByText('Concluido')).toBeInTheDocument()
  })

  test('displays no bookings message when no data is available', () => {
    ;(useGetUserBookings as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    })

    render(
      <Router>
        <User />
      </Router>
    )
    expect(
      screen.getByText('Você ainda não possui agendamentos')
    ).toBeInTheDocument()
  })

  test('pagination works correctly', () => {
    const setCurrentPage = jest.fn()
    ;(usePagination as jest.Mock).mockReturnValue({
      currentPage: 1,
      setCurrentPage,
      itens: mockBookings,
      numbers: [1, 2],
    })

    render(
      <Router>
        <User />
      </Router>
    )

    fireEvent.click(screen.getByText('2'))
    expect(setCurrentPage).toHaveBeenCalledWith(2)
  })

  test('new booking link works correctly', () => {
    render(
      <Router>
        <User />
      </Router>
    )
    expect(screen.getAllByText('Novo agendamento')[0]).toHaveAttribute(
      'href',
      '/agendamentos/novo'
    )
  })
})
