import e, { Request, Response } from 'express'
import { User } from '../../types/user'
import { prisma } from '../services/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10)
}

export const signup = async (req: Request, res: Response) => {
  const { fullname, document, phoneNumber, email, password } = req.body as User

  try {
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { email: email },
          { document: document },
          { phoneNumber: phoneNumber },
        ],
      },
    })

    if (user) {
      return res.status(400).json({ message: 'Usuário ja cadastrado' })
    }

    let newUser = {
      fullname,
      email,
      document,
      phoneNumber,
      password: await hashPassword(password),
    }
    await prisma.users.create({
      data: newUser,
    })

    return res.status(201).json({ message: 'Usuário criado com sucesso.' })
  } catch (e) {
    console.log(e)
  }
}

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body as User
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(400).json({ message: 'Usuário não cadastrado!' })
    }

    // check if the password is correct or not
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Email e/ou senha incorretos.' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '15d' },
    )

    const payload = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
    }

    return res.status(200).send({ user: payload, token })
  } catch (e) {
    console.log(e)
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany()
    if (!users) {
      return res.status(400).json({ message: 'Nenhum usuário encontrado.' })
    }
    return res.status(200).json(users)
  } catch (e) {
    console.log(e)
  }
}

export const getForms = async (req: Request, res: Response) => {
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

export const getAvaliableDates = async (req: Request, res: Response) => {
  try {
    const availableSchedules = await prisma.schedule.findMany({
      include: { timeslots: true },
    })

    return res.status(200).json(availableSchedules)
  } catch (error) {}
}

export const getUser = async (req: any, res: Response) => {
  try {
    const user = await prisma.users.findUnique({
      where: { email: req.user.email },
    })

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' })
    }

    console.log(user)
    return res.status(200).json(user)
  } catch (e) {
    console.log(e)
  }
}

export const createBooking = async (req: Request, res: Response) => {}

export const updateUserImg = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const image = req.file.filename

    if (!id) {
      return res.status(400).json({ message: 'Id não informado.' })
    }

    const updatedData = {
      ...req.body,
      profileImage: `/images/${image}`,
    }

    const updatedUser = await prisma.users.update({
      where: { id: id },
      data: updatedData,
    })

    return res
      .status(200)
      .json({ message: 'Usuário atualizado com sucesso.', user: updatedUser })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Erro ao atualizar o usuário.' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'Id não informado.' })
    }

    await prisma.booking.deleteMany({
      where: { userId: id },
    })

    await prisma.users.delete({
      where: { id: id },
    })

    return res.status(200).json({ message: 'Usuário deletado com sucesso.' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Erro ao deletar o usuário.' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const updatedUser = await prisma.users.update({
      where: { id: id },
      data: { ...req.body },
    })

    return res
      .status(200)
      .json({ message: 'Usuário atualizado com sucesso.', user: updatedUser })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Erro ao atualizar o usuário.' })
  }
}

export const getForm = async (req: Request, res: Response) => {
  try {
    console.log('aqui')
    const form = await prisma.form.findFirst({
      where: { id: req.body.id },
      include: { form_fields: true },
    })

    if (!form) {
      return res.status(400).json({ message: 'Formulário não encontrado.' })
    }

    return res.status(200).json(form)
  } catch (error) {
    console.log(error)
  }
}
