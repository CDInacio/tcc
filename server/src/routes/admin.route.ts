import express from 'express'
import {
  createForm,
  deleteForm,
  getDataOverview,
  updateFormStatus,
} from '../controllers/form.controller'
import { isAdmin, isAuth } from '../middlewares/auth'

export const adminRouter = express.Router()

adminRouter.post('/form/create', isAuth, isAdmin, createForm)
adminRouter.delete('/form/delete/:id', isAuth, isAdmin, deleteForm)
adminRouter.put('/form/updateStatus/:id', isAuth, isAdmin, updateFormStatus)
adminRouter.get('/getDataOverview', isAuth, isAdmin, getDataOverview)
