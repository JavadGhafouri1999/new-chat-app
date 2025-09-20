import http from "http";
import chalk from "chalk";
import { Server } from "socket.io";
import { APP_ORIGIN } from "./env";
import appAssert from "./appAssert";
import express, { type Application } from "express";
import { BAD_REQUEST } from "../constants/httpStatusCode";
import { socketAuthMiddleware, type AuthenticatedSocket } from "../middleware/socket.auth.middleware";

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: { origin: [APP_ORIGIN], credentials: true },
});

// Apply auth middleware to all socket connections
io.use(socketAuthMiddleware);

// Check to see if user is online or not
export function getReceiverSocketId(userId: string) {
	return userSocketMap[userId];
}

// For storing online users
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
