import { Request, Response } from "express";
import { prisma } from "../services/prisma";

interface FormField {
  type: string;
  text: string;
  required: boolean;
}

export const createForm = async (req: any, res: Response) => {
  try {
    await prisma.form.create({
      data: {
        form_name: "teste",
        form_description: "teste",
        user_id: req.user.id,
        form_fields: {
          create: req.body.map((field: FormField) => ({
            field_type: field.type,
            field_required: field.required,
            field_name: field.text,
          })),
        },
      },
    });

    return res.status(201).json({ message: "Formulário criado com sucesso." });
  } catch (error) {
    console.log(error);
  }
};

export const getForms = async (req: any, res: Response) => {
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
