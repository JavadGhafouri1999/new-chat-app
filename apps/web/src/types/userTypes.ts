export type UserProfileDetails = {
	_id: string;
	username: string;
	email: string;
	password: string;
	profileImage: string;
	verified: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type loginData = {
	email: string;
	password: string;
};

export type signUpData = loginData & {
	username: string;
	confirmPassword: string;
};

export interface UserState {
	authUser: UserProfileDetails | null;
	isCheckingAuth: boolean;
	isSigningUp: boolean;
	isLoggingIn: boolean;
	checkAuth: () => void;
	signup: (data: signUpData) => void;
	login: (data: loginData) => void;
	logout: () => void;
}

export type MessageData = {
	senderId: string;
	receiverId: string;
	text: string;
	image: string;
	createdAt: Date;
};
