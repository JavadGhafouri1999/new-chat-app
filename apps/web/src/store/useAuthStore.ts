import { create } from "zustand";

type Store = {
	isLoading: boolean;
	isLoggedIn: boolean;
};

export const authStore = create<Store>((set) => ({
	authUser: null,
	isLoading: false,
	isLoggedIn: false,

	login: () => {
		set({ isLoggedIn: true });
	},
}));
