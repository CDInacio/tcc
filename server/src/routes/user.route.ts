import { Application } from "express";
import { Router } from "express";
import {
  getAllUsers,
  getAvaliableDates,
  getForms,
  signin,
  signup,
} from "../controllers/user.controller";
import { isAdmin, isAuth } from "../middlewares/auth";

export const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/getAll", isAuth, isAdmin, getAllUsers);
userRouter.get("/forms", isAuth, getForms);
userRouter.get('/avaliableDates', isAuth, getAvaliableDates);  
