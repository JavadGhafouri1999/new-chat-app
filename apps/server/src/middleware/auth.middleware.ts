import type { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/httpStatusCode";
import AppErrorCode from "../constants/errorCode";
import { ACCESS_TOKEN_SECRET } from "../utils/env";
import { tokenValidator } from "../utils/jwtToken";
import type mongoose from "mongoose";

const authProtect: RequestHandler = async (req, _, next) => {
	const accessToken = (req.cookies.accessToken as string) || undefined;
	appAssert(accessToken, UNAUTHORIZED, "Invalid or expired Access token", AppErrorCode.InvalidAccessToken);

	const { payload, error } = tokenValidator(accessToken, ACCESS_TOKEN_SECRET);
	appAssert(payload, UNAUTHORIZED, "Invalid or Expired Access Token", AppErrorCode.InvalidAccessToken);

	req.userId = payload.userId as mongoose.Types.ObjectId;
	req.sessionId = payload.sessionId as mongoose.Types.ObjectId;

	next();
};

export default authProtect;
