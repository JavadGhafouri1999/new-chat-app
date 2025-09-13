import AppErrorCode from "../constants/errorCode";
import { CONFLICT, NOT_FOUND, UNAUTHORIZED } from "../constants/httpStatusCode";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import type { CreateUser, LoginParams, UpdateUser } from "../types/authTypes";
import appAssert from "../utils/appAssert";
import { hashValue } from "../utils/bcrypt";
import cloudinary from "../utils/cloudinary";
import { sendWelcomeEmail } from "../utils/emailHandler";
import { ACCESS_TOKEN_SECRET, APP_ORIGIN, REFRESH_TOKEN_SECRET } from "../utils/env";
import { generateAccessToken, generateRefreshToken, tokenValidator } from "../utils/jwtToken";
import { tenDaysFromNow } from "../utils/timers";

export const createAccount = async (userData: CreateUser) => {
	// check for email
	const existingUserEmail = await UserModel.findOne({ email: userData.email });
	appAssert(!existingUserEmail, CONFLICT, "This email is already in use.", AppErrorCode.EmailAlreadyInUse);

	const newUser = await UserModel.create({
		username: userData.username,
		email: userData.email,
		password: userData.password,
		gender: userData.gender,
	});
	const userId = newUser._id.toString();

	const newSession = await SessionModel.create({ userId, userAgent: userData.userAgent });
	const sessionId = newSession._id.toString();

	const accessToken = generateAccessToken({ userId, sessionId }, ACCESS_TOKEN_SECRET);
	const refreshToken = generateRefreshToken(sessionId, REFRESH_TOKEN_SECRET);

	try {
		await sendWelcomeEmail(newUser.email, newUser.username, APP_ORIGIN);
	} catch (error) {
		console.log(error);
	}

	return { user: newUser.omitPassword(), accessToken, refreshToken };
};

export const login = async (userData: LoginParams) => {
	// check if we have the email
	const user = await UserModel.findOne({ email: userData.email });
	appAssert(user, UNAUTHORIZED, "Invalid Credentials", AppErrorCode.InvalidCredentials);
	const userId = user._id.toString();

	const isPasswordCorrect = await user.comparePassword(userData.password);
	appAssert(isPasswordCorrect, UNAUTHORIZED, "Invalid Credentials", AppErrorCode.InvalidCredentials);

	const session = await SessionModel.create({ userId, userAgent: userData.userAgent });
	const sessionId = session._id.toString();

	const accessToken = generateAccessToken({ userId, sessionId }, ACCESS_TOKEN_SECRET);
	const refreshToken = generateRefreshToken(sessionId, REFRESH_TOKEN_SECRET);

	return { user: user.omitPassword(), accessToken, refreshToken };
};

export const refreshAccessToken = async (refToken: string) => {
	const { payload } = tokenValidator(refToken, REFRESH_TOKEN_SECRET);
	appAssert(payload, UNAUTHORIZED, "Invalid or Expired Refresh Token", AppErrorCode.InvalidRefreshToken);

	const now = Date.now();
	const session = await SessionModel.findById(payload.sessionId);
	appAssert(
		session && session.expiresAt.getTime() > now,
		UNAUTHORIZED,
		"Session expired",
		AppErrorCode.UnauthorizedAccess
	);

	const user = await UserModel.findById(session.userId);
	appAssert(user, NOT_FOUND, "Session is not valid");

	// refresh session if it expires in the next 24hrs
	const refreshTheSession = session.expiresAt.getTime() - now <= 24 * 60 * 60 * 1000;
	if (refreshTheSession) {
		session.expiresAt = tenDaysFromNow();
		await session.save();
	}
	const userId = session.userId.toString();
	const sessionId = session._id.toString();

	const accessToken = generateAccessToken({ userId, sessionId }, ACCESS_TOKEN_SECRET);

	const newRefreshToken =
		refreshTheSession ? generateRefreshToken(sessionId, REFRESH_TOKEN_SECRET) : undefined;

	return { accessToken, newRefreshToken };
};

export const updateUser = async (data: UpdateUser, userId: string) => {
	const updateData: Partial<UpdateUser> = { ...data };

	if (data.profileImage) {
		const upload = await cloudinary.uploader.upload(data.profileImage);
		updateData.profileImage = upload.secure_url;
	}

	if (data.password) {
		updateData.password = await hashValue(data.password);
	}

	const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });

	return { user: user?.omitPassword() };
};
