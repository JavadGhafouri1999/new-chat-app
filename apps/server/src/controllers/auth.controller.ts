import AppErrorCode from "../constants/errorCode";
import { CREATED, OK, UNAUTHORIZED } from "../constants/httpStatusCode";
import { createAccount, login, refreshAccessToken } from "../services/auth.service";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import {
	clearAuthCookies,
	getAccessTokenCookieOptions,
	getRefreshTokenCookieOptions,
	setAuthCookies,
} from "../utils/cookie";
import { loginSchema, registerSchema } from "./auth.schemas";

export const registerHandler = catchErrors(async (req, res) => {
	const request = registerSchema.parse({ ...req.body, userAgent: req.headers["user-agent"] });

	const { user, accessToken, refreshToken } = await createAccount(request);

	return setAuthCookies({ res, accessToken, refreshToken })
		.status(CREATED)
		.json({ message: "✅ Account created!", user });
});

export const loginHandler = catchErrors(async (req, res) => {
	const request = loginSchema.parse(req.body);

	const { user, accessToken, refreshToken } = await login(request);

	return setAuthCookies({ res, accessToken, refreshToken })
		.status(OK)
		.json({ message: "✅ user logged in!", user });
});

export const logoutHandler = catchErrors(async (_, res) => {
	return clearAuthCookies(res).status(OK).json({ message: "Log out successful" });
});

export const refreshTokenHandler = catchErrors(async (req, res) => {
	const refreshToken = req.cookies.refreshToken as string | undefined;
	appAssert(refreshToken, UNAUTHORIZED, "There is no valid Token", AppErrorCode.InvalidRefreshToken);

	const { accessToken, newRefreshToken } = await refreshAccessToken(refreshToken);

	if (newRefreshToken) {
		res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
	}

	return res
		.status(OK)
		.cookie("accessToken", accessToken, getAccessTokenCookieOptions())
		.json({ message: "✅ Access Token refreshed" });
});
