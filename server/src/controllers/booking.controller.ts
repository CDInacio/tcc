import { Request, Response } from 'express'
import { prisma } from '../services/prisma'
import { formatDate } from '../utils/formateDate'
import { transporter } from '../services/email-service'

export const createBooking = async (req: any, res: Response) => {
  const { formId, ...formData } = req.body
  console.log(formData)
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: req.user.email,
      },
    })

    if (!user) {
      return res.status(403).json({ message: 'Usuário não encontrado!' })
    }

    if (!formId || !formData) {
      return res
        .status(400)
        .json({ message: 'Formulário ou dados do agendamento não fornecidos.' })
    }

    const timeSlot = await prisma.timeslot.findFirst({
      where: {
        time: formData.hora,
        available: true,
      },
    })

    if (!timeSlot) {
      console.log('Horário não disponível.')
      return res.status(400).json({ message: 'Horário não disponível.' })
    }

    // Update timeslot availability to false after booking is created
    await prisma.schedule.update({
      where: {
        date: formatDate(formData.data),
      },
      data: {
        timeslots: {
          updateMany: {
            where: {
              time: formData.hora,
            },
            data: {
              available: false,
            },
          },
        },
      },
    })

    // Create booking and send notification
    await prisma.booking.create({
      data: {
        form: {
          connect: { id: formId },
        },
        user: {
          connect: { id: user.id },
        },
        data: formData,
      },
    })

    await prisma.notification.create({
      data: {
        message: 'Novo agendamento!',
        description: `${formatDate(formData.data)} às ${formData.hora}`,
        recipientId: null,
        recipientRole: 'ADMIN',
      },
    })

    res.status(201).json({ message: 'Agendamento realizado com sucesso!' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Erro ao realizar o agendamento.' })
  }
}

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    })

    if (!bookings) {
      return res.status(404).json({ message: 'Nenhum agendamento encontrado!' })
    }

    res.status(200).json(bookings)
  } catch (error) {
    console.log(error)
  }
}

export const getUserBookings = async (req: any, res: Response) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: req.user.email,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        form: true,
      },
    })

    if (!bookings) {
      return res.status(404).json({ message: 'Nenhum agendamento encontrado!' })
    }

    res.status(200).json(bookings)
  } catch (error) {
    console.log(error)
  }
}

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status, userId, role, date, time } = req.body

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' })
    }

    let info = await transporter.sendMail({
      from: `"Agendamento" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Status do agendamento atualizado',
      html: `<div style="background-color: #4CAF50; padding: 20px;      text-align: center; color: white;">
       <h1 style="margin: 0;">Seu App</h1>
  <p>Obrigado por usar nossos serviços!</p>
</div>`,
    })

    if (status === 'concluido') {
      const schedule = await prisma.schedule.findFirst({
        where: {
          date: formatDate(date),
        },
        include: {
          timeslots: true,
        },
      })

      if (!schedule) {
        throw new Error('Schedule not found')
      }

      await prisma.schedule.update({
        where: {
          id: schedule.id,
        },
        data: {
          timeslots: {
            updateMany: {
              where: {
                time: time,
              },
              data: {
                available: true,
              },
            },
          },
        },
      })
    }

    const booking = await prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    })

    await prisma.notification.create({
      data: {
        message: 'Status do agendamento atualizado!',
        description:
          'O status do seu agendamento foi atualizado para ' + status,
        recipientId: userId,
        recipientRole: role,
      },
    })

    res.status(200).json(booking)
  } catch (error) {
    console.log(error)
  }
}

export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params
  const { date, time } = req.body

  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: id,
      },
    })

    if (!booking) {
      return res.status(404).json({ message: 'Agendamento não encontrado!' })
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        data: {
          date: date,
          time: time,
        },
      },
    })

    res.status(200).json(updatedBooking)
  } catch (error) {
    console.log(error)
  }
}
