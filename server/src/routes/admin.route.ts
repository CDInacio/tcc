import express from "express";
import { createForm, getForms } from "../controllers/form.controller";
import { isAdmin, isAuth } from "../middlewares/auth";

export const adminRouter = express.Router();

adminRouter.post("/form/create", isAuth, isAdmin, createForm);
adminRouter.get("/forms", isAuth, isAdmin, getForms);
