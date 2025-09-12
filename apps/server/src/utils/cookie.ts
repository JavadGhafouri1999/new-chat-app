import type { CookieOptions, Response } from "express";
import { NODE_ENV } from "./env";
import { elevenDaysFromNow, fifteenMinsFromNow } from "./timers";

export const REFRESH_PATH = "/api/auth/refresh";

type Params = {
	res: Response;
	refreshToken: string;
	accessToken: string;
};

const secure = NODE_ENV !== "development";

const defaults: CookieOptions = {
	sameSite: "strict",
	httpOnly: true,
	secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
	...defaults,
	expires: fifteenMinsFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
	...defaults,
	expires: elevenDaysFromNow(),
	path: REFRESH_PATH,
});

export const setAuthCookies = ({ res, refreshToken, accessToken }: Params) => {
	return res
		.cookie("accessToken", accessToken, getAccessTokenCookieOptions())
		.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res: Response) =>
	res.clearCookie("accessToken").clearCookie("refreshToken", { path: REFRESH_PATH });
