import type mongoose from "mongoose";
import { BAD_REQUEST, UNAUTHORIZED } from "../constants/httpStatusCode";
import UserModel, { type UserDocument } from "../models/user.model";
import appAssert from "../utils/appAssert";
import { ACCESS_TOKEN_SECRET } from "../utils/env";
import { tokenValidator } from "../utils/jwtToken";
import AppErrorCode from "../constants/errorCode";
import type { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
	user?: UserDocument;
	userId?: string;
}

export const socketAuthMiddleware = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
	try {
		// extract token from http-only cookies
		const token = socket.handshake.headers.cookie
			?.split("; ")
			.find((row: string) => row.startsWith("accessToken="))
			?.split("=")[1];
		appAssert(token, UNAUTHORIZED, "Invalid token");

		// Validate Token
		const { payload, error } = tokenValidator(token, ACCESS_TOKEN_SECRET);
		appAssert(payload, UNAUTHORIZED, "Invalid or Expired Access Token", AppErrorCode.InvalidAccessToken);

		// Find the user
		const userId = payload.userId as mongoose.Types.ObjectId;
		const user = await UserModel.findById(userId).select("-password");
		appAssert(user, BAD_REQUEST, "User not found");

		// Attach user info
		socket.user = user;
		socket.userId = user._id.toString();

		console.log(`Socket auth for user: ${user.username} - (${user._id})`);

		next();
	} catch (error) {
		console.log(error);
		next(error as Error);
	}
};
