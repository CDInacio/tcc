import express from 'express'
import { isAdmin, isAuth } from '../middlewares/auth'
import {
  createBooking,
  getBookings,
  getUserBookings,
  updateBooking,
  updateBookingStatus,
} from '../controllers/booking.controller'
import { getBookingById } from '../controllers/form.controller'

export const bookingRouter = express.Router()

bookingRouter.post('/create', isAuth, createBooking)
bookingRouter.get('/', isAuth, getBookings)
bookingRouter.get('/user', isAuth, getUserBookings)
bookingRouter.get('/forms/getBookingById/:id', isAuth, getBookingById)
bookingRouter.put('/updateStatus/:id', isAuth, isAdmin, updateBookingStatus)
bookingRouter.put('/update/:id', isAuth, isAdmin, updateBooking)
