import { Request, Response } from "express";
import { prisma } from "../services/prisma";

export const createBooking = async (req: any, res: Response) => {
  console.log(req.body)
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: req.user.email,
      },
    });

    if (!user) {
      return res.status(403).json({ message: "Usuário não encontrado!" });
    }

    await prisma.booking.create({
      data: {
        formId: req.body.formId,
        data: req.body,
        user: {
          connect: { id: user.id },
        },
      },
    });

    await prisma.notification.create({
      data: {
        message: "Agendamento realizado com sucesso!",
        description: "Seu agendamento foi realizado com sucesso!",
        recipientId: null,
        recipientRole: 'ADMIN'
      },
    });

    res.status(201).json({ message: "Agendamento realizado com sucesso!" });
  } catch (error) {
    console.log(error);
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    if (!bookings) {
      return res
        .status(404)
        .json({ message: "Nenhum agendamento encontrado!" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
  }
};

export const getUserBookings = async (req: any, res: Response) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: req.user.email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!bookings) {
      return res
        .status(404)
        .json({ message: "Nenhum agendamento encontrado!" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
  }
}

export const updateBookingStatus = async (req: Request, res: Response) => {

  try {
    const booking = await prisma.booking.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: req.body.status,
      },
    });
    

   await prisma.notification.create({
      data: {
        message: "Status do agendamento atualizado!",
        description: "O status do seu agendamento foi atualizado para " + req.body.status,
        recipientId: req.body.userId,
        recipientRole: req.body.role
      },
   });


    res.status(200).json(booking);
  } catch (error) {
    console.log(error);
  }
}