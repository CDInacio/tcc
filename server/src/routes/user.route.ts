import multer from 'multer'
import { Application } from 'express'
import { Router } from 'express'
import {
  deleteUser,
  getAllUsers,
  getAvaliableDates,
  getForm,
  getForms,
  getUser,
  signin,
  signup,
  updateUser,
  updateUserImg,
} from '../controllers/user.controller'
import { isAdmin, isAuth } from '../middlewares/auth'
import { upload } from '../middlewares/upload'

export const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/signin', signin)
userRouter.get('/getUser/', isAuth, getUser)
userRouter.delete('/deleteUser/:id', isAuth, isAdmin, deleteUser)
userRouter.get('/getAll', isAuth, isAdmin, getAllUsers)
userRouter.get('/forms', isAuth, getForms)
userRouter.get('/getForm/:id', isAuth, getForm)
userRouter.get('/avaliableDates', isAuth, getAvaliableDates)
userRouter.put(
  '/updateUserImg/:id',
  isAuth,
  upload.single('image'),
  updateUserImg,
)
userRouter.put('/updateUser/:id', isAuth, updateUser)
