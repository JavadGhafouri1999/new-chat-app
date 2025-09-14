import { create } from "zustand";
import type { loginData, signUpData, UserState } from "../types/userTypes";
import { axiosInstance } from "../api/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useAuthStore = create<UserState>((set) => ({
	authUser: null,
	isUserloggedIn: false,
	isCheckingAuth: true,
	isSigningUp: false,
	isLoggingIn: false,

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
			set({ authUser: res.data });
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
}));
