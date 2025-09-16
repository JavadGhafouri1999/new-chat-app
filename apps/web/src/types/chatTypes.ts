import type { UserProfileDetails } from "./userTypes";

export type Message = {
	senderId: string;
	receiverId: string;
	text: string;
	image: string;
	createdAt: Date;
};

export type ChatStore = {
	allContact: UserProfileDetails[];
	chats: UserProfileDetails[];
	messages: Message[];
	activeTab: "chats" | "contacts";
	selectedUser: UserProfileDetails | null;
	isUsersLoading: boolean;
	isMessagesLoading: boolean;
	isSoundEnabled: boolean;
	toggleSound: () => void;
	getAllChatPartners: () => void;
	getAllContacts: () => void;
	setSelectedUser: (selectedUser: UserProfileDetails | null) => void;
	setActiveTab: (tab: "chats" | "contacts") => void;
};
