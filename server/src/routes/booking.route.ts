import express from "express";
import { isAdmin, isAuth } from "../middlewares/auth";
import { createBooking, getBookings, getUserBookings, getUserNotifications, markAsRead, updateBookingStatus } from "../controllers/booking.controller";
import { getBookingById, updateFormStatus } from "../controllers/form.controller";

export const bookingRouter = express.Router();

bookingRouter.post("/create", isAuth, createBooking);
bookingRouter.get("/", isAuth, getBookings);
bookingRouter.get("/user", isAuth, getUserBookings);
bookingRouter.get("/forms/getBookingById/:id", isAuth, isAdmin, getBookingById);
bookingRouter.get("/forms/getuserNotifications", isAuth, getUserNotifications);
bookingRouter.put("/notifications/markAsRead/:id?", isAuth, markAsRead); 
bookingRouter.route("/updateStatus/:id").put(isAuth, isAdmin, updateBookingStatus);