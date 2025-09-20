import jwt, { type JwtPayload } from "jsonwebtoken";

export const generateAccessToken = (
	{ userId, sessionId }: { userId: string; sessionId: string },
	secret: string
) => {
	return jwt.sign({ userId, sessionId }, secret, {
		expiresIn: "15m",
	});
};

export const generateRefreshToken = (sessionId: string, secret: string) => {
	return jwt.sign({ sessionId }, secret, {
		expiresIn: "10d",
	});
};

export const tokenValidator = <T extends object = JwtPayload>(token: string, secret: string) => {
	try {
		const payload = jwt.verify(token, secret) as T;
		return { payload };
	} catch (error: any) {
		return { error: error.message };
	}
};
