import { create } from "zustand";
import type { ChatStore, MessageData } from "../types/chatTypes";
import { axiosInstance } from "../api/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const notificationSound = new Audio("/sounds/notification.mp3");

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

		const { authUser } = useAuthStore.getState();

		// null checks
		if (!authUser || !selectedUser) {
			toast.error("مشکلی در ارسال پیام بوجود آمد");
			return;
		}

		const tempId = `temp-${Date.now()}`;

		const optimisticMessage = {
			_id: tempId,
			senderId: authUser?._id,
			receiverId: selectedUser?._id,
			text: data.text,
			image: data.image,
			createdAt: new Date().toISOString(),
			isOptimistic: true,
		};

		set({ messages: [...messages, optimisticMessage] });

		try {
			const res = await axiosInstance.post(`/message/send/${selectedUser?._id}`, data);
			set({ messages: messages.concat(res.data) });
		} catch (error) {
			set({ messages: messages });
			console.log(error);
			toast.error("مشکلی در ارسال پیام بوجود آمد");
		}
	},

	subscribeToMessages: () => {
		const { selectedUser, isSoundEnabled } = get();
		if (!selectedUser) return;

		const socket = useAuthStore.getState().socket;

		socket?.on("newMessage", (newMessage) => {
			const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
			if (!isMessageSentFromSelectedUser) return;
			
			const currentMessages = get().messages;
			set({ messages: [...currentMessages, newMessage] });

			if (isSoundEnabled) {
				notificationSound.currentTime = 0;
				notificationSound.play().catch((e) => console.log("audio Error Notification:\n", e));
			}
		});
	},

	unsubscribeToMessages: () => {
		const socket = useAuthStore.getState().socket;
		socket?.off("newMessage");
	},
}));
