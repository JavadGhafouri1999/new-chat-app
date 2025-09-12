import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// others
import connectDB from "./config/db";
import errorMiddleware from "./middleware/errorMiddleware";
import { APP_ORIGIN, PORT } from "./utils/env";
// Routes
import authRouter from "./routes/auth.route";
import messageRouter from "./routes/message.route";

/* -------------------------------------------------------------------------- */
/*                                   Configs                                  */
/* -------------------------------------------------------------------------- */

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: APP_ORIGIN, credentials: true }));
app.use(cookieParser());

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
// Private routes will use auth middleware to check the user first
// public(Mostly)
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

/* -------------------------------------------------------------------------- */
/*                                 MiddleWare                                 */
/* -------------------------------------------------------------------------- */

app.use(errorMiddleware);

/* -------------------------------------------------------------------------- */
/*                                 Server & DB                                */
/* -------------------------------------------------------------------------- */

app.listen(PORT, async () => {
	await connectDB();
	console.log(`Server is running on ${PORT}\nhttp://localhost:5001`);
});
