import { create } from "zustand";
import type { loginData, signUpData, UserState, UserUpdateData } from "../types/userTypes";
import { axiosInstance } from "../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/api";

export const useAuthStore = create<UserState>((set, get) => ({
	authUser: null,
	onlineUsers: [],
	isCheckingAuth: true,
	isSigningUp: false,
	isLoggingIn: false,
	socket: null,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/refresh");
			set({ authUser: res.data.user });
		} catch (error: unknown) {
			set({ authUser: null });
			if (error instanceof AxiosError) {
				console.log(error.message);
			} else {
				toast.error("مشکلی در احراز بوجود آمده");
			}
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	signup: async (data: signUpData) => {
		set({ isSigningUp: true });
		try {
			const res = await axiosInstance.post("/auth/register", data);
			set({ authUser: res.data });
			get().connectSocket();
			toast.success("حساب کاربری شما ساخته شد.");
		} catch (error: unknown) {
			set({ authUser: null });
			if (error instanceof AxiosError) {
				toast.error(error.message);
			} else {
				toast.error("مشکلی در ساخت حساب بوجود آمده");
			}
		} finally {
			set({ isSigningUp: false });
		}
	},

	login: async (data: loginData) => {
		set({ isLoggingIn: true });
		try {
			const res = await axiosInstance.post("/auth/login", data);
			set({ authUser: res.data?.user });
			get().connectSocket();
			toast.success("خوش آمدید");
		} catch (error: unknown) {
			set({ authUser: null });
			if (error instanceof AxiosError) {
				toast.error(error.message);
			} else {
				toast.error("مشکلی در ورود به حساب بوجود آمده");
			}
		} finally {
			set({ isLoggingIn: false });
		}
	},

	logout: async () => {
		try {
			await axiosInstance.get("/auth/logout");
			set({ authUser: null });
			get().disconnectSocket();
		} catch (error) {
			console.log(error);
		}
	},

	updateUserProfile: async (data: UserUpdateData) => {
		try {
			const res = await axiosInstance.put("/auth/update-profile", data);
			set({ authUser: res.data?.user });
			toast.success("بروزرسانی انجام شد");
		} catch (error) {
			console.log(error);
			toast.error("مشکلی در بروزرسانی بوجود آمد");
		}
	},

	connectSocket: () => {
		const { authUser } = get();
		if (!authUser || get().socket?.connected) return;

		const socket = io(BASE_URL, { withCredentials: true });

		socket.connect();

		set({ socket });

		// Listen for online users
		socket.on("getOnlineUsers", (userId) => {
			set({ onlineUsers: userId });
		});
	},

	disconnectSocket: () => {
		if (get().socket?.connected) {
			get().socket?.disconnect();
		}
	},
}));
