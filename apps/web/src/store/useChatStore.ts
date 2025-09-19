import { create } from "zustand";
import type { ChatStore, MessageData } from "../types/chatTypes";
import { axiosInstance } from "../api/axios";
import toast from "react-hot-toast";

export const useChatStore = create<ChatStore>((set, get) => ({
	allContact: [],
	chats: [],
	messages: [],
	activeTab: "chats",
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,
	isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled") || "false") === true,

	toggleSound: () => {
		const newValue = !get().isSoundEnabled;
		localStorage.setItem("isSoundEnabled", newValue.toString());
		set({ isSoundEnabled: newValue });
	},

	setActiveTab: (tab: "chats" | "contacts") => {
		set({ activeTab: tab });
	},

	setSelectedUser: (selectedUser) => {
		set({ selectedUser });
	},

	getAllContacts: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await axiosInstance.get("/message/contacts");
			set({ allContact: res.data });
		} catch (error) {
			console.log(error);
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getAllChatPartners: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await axiosInstance.get("/message/chats");
			set({ chats: res.data });
		} catch (error) {
			console.log(error);
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getMessagesByUserId: async (userId: string) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance(`/message/${userId}`);
			set({ messages: res.data });
			console.log(res.data);
		} catch (error) {
			console.log(error);
			toast.error("مشکلی در دریافت پیام ها بوجود آمد");
		} finally {
			set({ isMessagesLoading: false });
		}
	},

	sendMessageData: async (data: MessageData) => {
		const { selectedUser, messages } = get();
		try {
			const res = await axiosInstance.post(`/message/send/${selectedUser?._id}`, data);
			set({ messages: messages.concat(res.data) });
		} catch (error) {
			console.log(error);
			toast.error("مشکلی در ارسال پیام بوجود آمد");
		}
	},
}));
