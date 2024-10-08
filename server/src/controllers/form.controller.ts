import { Request, Response } from 'express'
import { prisma } from '../services/prisma'

interface FormField {
  type: string
  text: string
  required: boolean
}

export const createForm = async (req: any, res: Response) => {
  try {
    await prisma.form.create({
      data: {
        form_name: req.body.formName,
        form_description: req.body.formDescription,
        user_id: req.user.id,
        form_fields: {
          create: req.body.fields.map((field: FormField) => ({
            field_type: field.type,
            field_required: field.required,
            field_name: field.text,
          })),
        },
      },
    })

    return res.status(201).json({ message: 'Formulário criado com sucesso.' })
  } catch (error) {
    console.log(error)
  }
}

export const deleteForm = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    await prisma.form.delete({
      where: { id },
    })

    return res.status(200).json({ message: 'Formulário deletado com sucesso.' })
  } catch (error) {
    console.log(error)
  }
}

export const updateFormStatus = async (req: Request, res: Response) => {
  const { id } = req.params
  const { isActive } = req.body

  try {
    // 1. Se o formulário está sendo ativado, desative todos os outros
    if (isActive) {
      await prisma.form.updateMany({
        where: {
          id: {
            not: id,
          },
        },
        data: {
          isActive: false,
        },
      })
    }

    await prisma.form.update({
      where: {
        id: id,
      },
      data: {
        isActive: isActive,
      },
    })

    return res.status(200).json({ message: 'Atualizado com sucesso' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getAdminForms = async (req: Request, res: Response) => {
  try {
    const forms = await prisma.form.findMany({
      include: { form_fields: true, user: true },
    })
    console.log(forms)

    if (forms.length === 0) {
      return res.status(400).json({ message: 'Nenhum formulário encontrado.' })
    }

    return res.status(200).json(forms)
  } catch (error) {
    console.log(error)
  }
}

export const getUserForms = async (req: Request, res: Response) => {
  try {
    const forms = await prisma.form.findMany({
      where: { isActive: true },
      include: { form_fields: true, user: true },
    })

    if (forms.length === 0) {
      return res.status(400).json({ message: 'Nenhum formulário encontrado.' })
    }

    return res.status(200).json(forms)
  } catch (error) {
    console.log(error)
  }
}

export const getBookingById = async (req: Request, res: Response) => {
  console.log(req.params)
  const { id } = req.params
  try {
    const form = await prisma.booking.findUnique({
      where: { id },
    })
    console.log(form)
    if (!form) {
      return res.status(400).json({ message: 'Formulário não encontrado.' })
    }

    return res.status(200).json(form)
  } catch (error) {
    console.log(error)
  }
}

export const getDataOverview = async (req: Request, res: Response) => {
  try {
    const forms = await prisma.form.findMany()
    const bookings = await prisma.booking.findMany()

    const totalBookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    })

    const totalUsers = await prisma.users.count()

    const newUsersLastMonth = await prisma.users.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Últimos 30 dias
        },
      },
    })

    const recentBookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({
      forms: forms.length,
      bookings: bookings.length,
      totalUsers,
      newUsersLastMonth,
      totalBookingsByStatus,
      recentBookingsCount: recentBookings.length,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Erro ao obter visão geral dos dados' })
  }
}
