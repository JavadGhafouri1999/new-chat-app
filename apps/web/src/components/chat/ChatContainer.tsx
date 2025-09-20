import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import NoChatHistoryPlaceholder from "../NoChatHistoryPlaceholder";
import MessagesLoadingSkeleton from "../skeleton/MessagesLoadingSkeleton";

export default function ChatContainer() {
	const {
		selectedUser,
		getMessagesByUserId,
		isMessagesLoading,
		messages,
		subscribeToMessages,
		unsubscribeToMessages,
	} = useChatStore();
	const { authUser } = useAuthStore();

	const messageEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!selectedUser) return;
		getMessagesByUserId(selectedUser._id);
		subscribeToMessages();

		return () => unsubscribeToMessages();
	}, [getMessagesByUserId, selectedUser, subscribeToMessages, unsubscribeToMessages]);

	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<>
			<ChatHeader />
			<div className="flex-1 md:px-2 overflow-y-auto py-8">
				{messages.length > 0 && !isMessagesLoading ?
					<div className="w-full md:px-2 space-y-2 my-2">
						{messages.map((msg) => (
							<div
								key={msg._id}
								className={`chat ${msg.senderId === authUser?._id ? "chat-start" : "chat-end"} `}>
								<div className="hidden md:block chat-image avatar">
									<div className="w-9 rounded-full">
										<img
											alt="Tailwind CSS chat bubble component"
											src={
												msg.senderId === authUser?._id ?
													authUser?.profileImage || "./user.png"
												:	selectedUser?.profileImage || "./user.png"
											}
										/>
									</div>
								</div>
								<div className="chat-header flex items-center gap-2 ">
									<time className="text-xs opacity-50">
										{new Date(msg.createdAt).toLocaleTimeString(undefined, {
											hour: "2-digit",
											minute: "2-digit",
											hour12: false,
										})}
									</time>
									{msg.senderId === authUser?._id ?
										authUser?.username
									:	selectedUser?.username}
								</div>
								<div
									className={`chat-bubble min-w-18 max-w-[70%] my-2 px-3 sm:px-2 mx-0 ltr ${msg.senderId === authUser?._id ? "bg-cyan-700/50" : "bg-slate-900/50"}`}
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
											className="py-2 w-full break-words"
											style={{ transform: "scaleX(-1)" }}>
											{msg.text}
										</div>
									)}
								</div>
							</div>
						))}
						<div className="" ref={messageEndRef} />
					</div>
				: isMessagesLoading ?
					<MessagesLoadingSkeleton />
				:	<NoChatHistoryPlaceholder name={selectedUser?.username ?? null} />}
			</div>
			<MessageInput />
		</>
	);
}
