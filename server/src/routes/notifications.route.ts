import express from "express";
import { isAuth, isAdmin } from "../middlewares/auth";
import { getNotifications, markAsRead } from "../controllers/notifications.controller";
import { updateBookingStatus } from "../controllers/booking.controller";

export const notificationsRouter = express.Router();

notificationsRouter.put("/markAsRead/:id?", isAuth, markAsRead);
notificationsRouter.get("/getNotifications", isAuth, getNotifications);