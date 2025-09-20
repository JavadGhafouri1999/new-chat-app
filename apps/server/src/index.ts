import "dotenv/config";
import cors from "cors";
import path from "node:path";
import express from "express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "node:url";
// others
import connectDB from "./config/db";
import { app, server } from "./utils/socket";
import { APP_ORIGIN, PORT } from "./utils/env";
import errorMiddleware from "./middleware/error.middleware";
// Routes
import authRouter from "./routes/auth.route";
import messageRouter from "./routes/message.route";
import jsonValidator from "./middleware/jsonValidator.middleware";

/* -------------------------------------------------------------------------- */
/*                                   Configs                                  */
/* -------------------------------------------------------------------------- */

app.use(express.json({ limit: "5mb" }));
app.use(jsonValidator);
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
/*                               Server & Build                               */
/* -------------------------------------------------------------------------- */
if (process.env.NODE_ENV === "production") {
	// Create __dirname equivalent for ES modules
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	// Serve static files from the web directory inside dist
	app.use(express.static(path.join(__dirname, "web")));
	app.get(/^(?!\/api).*/, (_, res) => {
		res.sendFile(path.join(__dirname, "web", "index.html"));
	});
}

server.listen(PORT, async () => {
	await connectDB();
	console.log(`Server is running on ${PORT}\nhttp://localhost:5001`);
});
