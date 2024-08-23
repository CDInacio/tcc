import express from "express";
import { isAdmin, isAuth } from "../middlewares/auth";
import { createBooking, getBookings, getUserBookings,  updateBookingStatus } from "../controllers/booking.controller";
import { getBookingById } from "../controllers/form.controller";

export const bookingRouter = express.Router();

bookingRouter.post("/create", isAuth, createBooking);
bookingRouter.get("/", isAuth, getBookings);
bookingRouter.get("/user", isAuth, getUserBookings);
bookingRouter.get("/forms/getBookingById/:id", isAuth, isAdmin, getBookingById);
bookingRouter.route("/updateStatus/:id").put(isAuth, isAdmin, updateBookingStatus);