import express from "express";
import { isAuth } from "../middlewares/auth";
import { createBooking, getBookings } from "../controllers/booking.controller";

export const bookingRouter = express.Router();

bookingRouter.post("/create", isAuth, createBooking);
bookingRouter.get("/", isAuth, getBookings);
