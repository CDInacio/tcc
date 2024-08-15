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
  const {status} = req.body

  try {
    await prisma.booking.update({
      where: {
        id: id
      }, 
      data: {
        status: status
      }
    })

    return res.status(200).json({message: 'atualizado'})

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
