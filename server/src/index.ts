import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRouter as userRoutes } from "./routes/user.route";
import { adminRouter } from "./routes/admin.route";
import { bookingRouter } from "./routes/booking.route";
import { notificationsRouter } from "./routes/notifications.route";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/admin", adminRouter);
app.use("/booking", bookingRouter);
app.use("/notifications", notificationsRouter);

const port = process.env.PORT || 3001;

app.listen(port || 30001, () => console.log(`Server is running on port ${port}`));