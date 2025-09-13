export type CreateUser = {
	username: string;
	email: string;
	password: string;
	gender: "male" | "female";
	confirmPassword: string;
	userAgent?: string | undefined;
};

export type UpdateUser = {
	username?: string | undefined;
	password?: string | undefined;
	profileImage?: string | undefined;
};

export type LoginParams = {
	email: string;
	password: string;
	userAgent?: string | undefined;
};

export type ResetPasswordParams = {
	verificationCode: string;
	newPassword: string;
};

export type VerifyParams = {
	token: string;
	authHeader: string;
};
