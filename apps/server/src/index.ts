import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
// others
import connectDB from "./config/db";
import errorMiddleware from "./middleware/error.middleware";
import { APP_ORIGIN, PORT } from "./utils/env";
// Routes
import authRouter from "./routes/auth.route";
import messageRouter from "./routes/message.route";
import jsonValidator from "./middleware/jsonValidator.middleware";

/* -------------------------------------------------------------------------- */
/*                                   Configs                                  */
/* -------------------------------------------------------------------------- */

const app = express();
app.use(express.json({ limit: "4mb" }));
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

	// Correct path in Turborepo: go up 3 levels to root, then into apps/web/dist
	app.use(express.static(path.join(__dirname, "../../../web/dist")));
	app.get(/^(?!\/api).*/, (req, res) => {
		res.sendFile(path.join(__dirname, "../../../web/dist/index.html"));
	});
}

app.listen(PORT, async () => {
	await connectDB();
	console.log(`Server is running on ${PORT}\nhttp://localhost:5001`);
});
