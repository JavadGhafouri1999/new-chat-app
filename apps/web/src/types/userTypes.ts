import { Socket } from "socket.io-client";

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

export type UserUpdateData = {
	// username?: string;
	password?: string;
	profileImage?: string;
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
	onlineUsers: string[];
	isCheckingAuth: boolean;
	isSigningUp: boolean;
	isLoggingIn: boolean;
	checkAuth: () => void;
	signup: (data: signUpData) => void;
	login: (data: loginData) => void;
	logout: () => void;
	updateUserProfile: (data: UserUpdateData) => void;
	connectSocket: () => void;
	disconnectSocket: () => void;
	socket: Socket | null;
}
