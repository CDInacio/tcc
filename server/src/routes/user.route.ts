import multer from 'multer';
import { Application } from "express";
import { Router } from "express";
import {
  getAllUsers,
  getAvaliableDates,
  getForms,
  signin,
  signup,
  updateUser,
} from "../controllers/user.controller";
import { isAdmin, isAuth } from "../middlewares/auth";
import { upload } from '../middlewares/upload';


export const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/getAll", isAuth, isAdmin, getAllUsers);
userRouter.get("/forms", isAuth, getForms);
userRouter.get('/avaliableDates', isAuth, getAvaliableDates);  
userRouter.put('/updateUser/:id',  isAuth, upload.single('image'), updateUser);