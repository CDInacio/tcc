import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRouter as userRoutes } from "./routes/user.route";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);

app.listen(3000, () => console.log("Server is running on port 3000"));
