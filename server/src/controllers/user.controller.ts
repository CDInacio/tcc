import { Request, Response } from "express";
import { User } from "../../types/user";
import { prisma } from "../services/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const signup = async (req: Request, res: Response) => {
  const { fullname, email, password } = req.body as User;

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (user) {
      return res.status(400).json({ message: "O email já está em uso." });
    }

    let newUser = {
      fullname,
      email,
      password: await hashPassword(password),
    };

    await prisma.users.create({
      data: newUser,
    });

    return res.status(201).json({ message: "Usuário criado com sucesso." });
  } catch (e) {
    console.log(e);
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body as User;
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Usuário não cadastrado!" });
    }

    // check if the password is correct or not
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Email e/ou senha incorretos." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15d" }
    );

    const payload = {
      name: user.fullname,
      email: user.email,
      role: user.role,
    };

    return res.status(200).send({ user: payload, token });
  } catch (e) {
    console.log(e);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany();
    if (!users) {
      return res.status(400).json({ message: "Nenhum usuário encontrado." });
    }
    return res.status(200).json(users);
  } catch (e) {
    console.log(e);
  }
};

export const getForms = async (req: Request, res: Response) => {
  try {
    const forms = await prisma.form.findMany({
      include: { form_fields: true, user: true },
    });

    if (forms.length === 0) {
      return res.status(400).json({ message: "Nenhum formulário encontrado." });
    }

    return res.status(200).json(forms);
  } catch (error) {
    console.log(error);
  }
};
