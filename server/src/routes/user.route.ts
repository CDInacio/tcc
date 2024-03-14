import { Application } from "express";
import { Router } from "express";
import { getAllUsers, signin, signup } from "../controllers/user.controller";
import { isAdmin, isAuth } from "../middlewares/auth";

export const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/getAll", isAuth, isAdmin, getAllUsers);
