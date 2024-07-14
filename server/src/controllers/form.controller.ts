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
    });

    return res.status(201).json({ message: "Formulário criado com sucesso." });
  } catch (error) {
    console.log(error);
  }
};

export const deleteForm = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.form.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Formulário deletado com sucesso." });
  } catch (error) {
    console.log(error);
  }
}


export const updateFormStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.$transaction(async (prisma) => {
      // Definir todos os formulários como falsos
      await prisma.form.updateMany({
        data: { isActive: false },
      });

      // Atualizar o formulário específico para verdadeiro
      const updatedForm = await prisma.form.update({
        where: { id },
        data: { isActive: true },
      });

      return updatedForm;
    });

    // Buscar o formulário atualizado para retornar na resposta
    const updatedForm = await prisma.form.findUnique({
      where: { id },
    });

    return res.status(200).json(updatedForm);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAdminForms = async (req: Request, res: Response) => {
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

export const getUserForms = async (req: Request, res: Response) => {
  try {
    const forms = await prisma.form.findMany({
      where: { isActive: true },
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
