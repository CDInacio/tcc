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
        message: "Novo agendamento realizado!",
        userId: user.id,
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

export const getUserNotifications = async (req: any, res: Response) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: req.user.email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        read: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!notifications) {
      return res
        .status(404)
        .json({ message: "Nenhuma notificação encontrada!" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
  }
}

export const markAsRead = async (req: any, res: Response) => {
  const data = await prisma.notification.updateMany({
    where: {
      read: false,
    },
    data: {
      read: true,
    },
  });
  console.log(data)

  res.status(200).json({ message: "Notificações marcadas como lidas!" });
}