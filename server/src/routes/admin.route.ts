import express from "express";
import { createForm, updateFormStatus } from "../controllers/form.controller";
import { isAdmin, isAuth } from "../middlewares/auth";

export const adminRouter = express.Router();

adminRouter.post("/form/create", isAuth, isAdmin, createForm);
adminRouter.put("/forms/updateStatus/:id", isAuth, isAdmin, updateFormStatus);
