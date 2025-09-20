import { Server } from "socket.io";
import http from "http";
import express, { type Application } from "express";
import { APP_ORIGIN } from "./env";
import { socketAuthMiddleware, type AuthenticatedSocket } from "../middleware/socket.auth.middleware";
import appAssert from "./appAssert";
import { BAD_REQUEST } from "../constants/httpStatusCode";
import chalk from "chalk";

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: { origin: [APP_ORIGIN], credentials: true },
});

// Apply auth middleware to all socket connections
io.use(socketAuthMiddleware);
const userSocketMap: { [userId: string]: string } = {};

io.on("connection", (socket: AuthenticatedSocket) => {
	console.log("A user connected", chalk.green(socket.user?.username));

	const userId = socket.userId;
	if (!userId) appAssert(userId, BAD_REQUEST, "No user ID");

	userSocketMap[userId] = socket.id;
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log(chalk.red("A user disconnected"));
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { io, app, server };
