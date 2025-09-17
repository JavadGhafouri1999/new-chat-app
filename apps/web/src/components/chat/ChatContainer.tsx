import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import NoChatHistoryPlaceholder from "../NoChatHistoryPlaceholder";

export default function ChatContainer() {
	const { selectedUser, getMessagesByUserId, isMessagesLoading, messages } = useChatStore();
	const { authUser } = useAuthStore();

	useEffect(() => {
		if (!selectedUser) return;
		getMessagesByUserId(selectedUser._id);
	}, [getMessagesByUserId, selectedUser]);

	if (isMessagesLoading) return <div className="">Loading Messages</div>;
	return (
		<>
			<ChatHeader />
			{messages.length > 0 ?
				<div className="w-full px-2 space-y-5 my-4 ">
					{messages.map((msg) => (
						<div
							key={msg._id}
							className={`chat ${msg.senderId === authUser?._id ? "chat-start" : "chat-end"} `}>
							<div className="hidden md:block chat-image avatar">
								<div className="w-9 rounded-full">
									<img
										alt="Tailwind CSS chat bubble component"
										src={`${
											msg.senderId === authUser?._id ?
												authUser?.profileImage || "./user.png"
											:	selectedUser?.profileImage || "./user.png"
										}`}
									/>
								</div>
							</div>
							<div className="chat-header flex items-center gap-2 ">
								<time className="text-xs opacity-50">
									{msg.createdAt.toString().slice(11, 16)}
								</time>
								{selectedUser?.username}
							</div>
							<div
								className="chat-bubble bg-slate-900/50 my-2 px-1 sm:px-2 mx-0 ltr"
								style={{ transform: "scaleX(-1)" }}>
								{msg.image && (
									<div
										onClick={() => console.log("first")}
										className="w-full h-48 overflow-hidden"
										style={{ transform: "scaleX(-1)" }}>
										<img
											src={msg.image}
											alt="message image"
											className="object-contain w-full h-full"
										/>
									</div>
								)}
								{msg.text && (
									<div
										className="flex items-center py-2 w-full"
										style={{ transform: "scaleX(-1)" }}>
										{msg.text}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			:	<NoChatHistoryPlaceholder name={selectedUser?.username ?? null} />}
			<MessageInput />
		</>
	);
}
