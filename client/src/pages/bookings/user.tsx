'use client'

import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'

export function User() {
  return (
    <>
      <Button className="mt-10">
        <Link to="/agendamentos/novo">Novo agendamento</Link>
      </Button>
      <p>ola</p>
    </>
  )
}
