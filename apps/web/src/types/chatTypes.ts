import type { UserProfileDetails } from "./userTypes";

export type Message = {
	_id: string;
	senderId: string;
	receiverId: string;
	text: string;
	image: string;
	createdAt: Date;
};

export type MessageData = {
	text?: string;
	image?: string;
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
	sendMessageData: (data: MessageData) => void;
	setSelectedUser: (selectedUser: UserProfileDetails | null) => void;
	getMessagesByUserId: (userId: string) => void;
	setActiveTab: (tab: "chats" | "contacts") => void;
};
