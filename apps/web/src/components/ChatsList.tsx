import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UserLoadingSkeleton from "./skeleton/UserLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

export default function ChatsList() {
	const { getAllChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();

	useEffect(() => {
		getAllChatPartners();
	}, [getAllChatPartners]);

	if (isUsersLoading) return <UserLoadingSkeleton />;
	if (chats.length === 0) return <NoChatsFound />;

	return (
		<>
			{chats.map((chat) => (
				<div
					key={chat._id}
					className="md:bg-cyan-500/10 md:p-3 rounded-lg cursor-pointer md:hover:bg-cyan-500/30 transition-colors flex items-center justify-center w-full"
					onClick={() => setSelectedUser(chat)}>
					<div className="flex items-center justify-between md:w-full gap-3">
						<div className={`avatar avatar-online`}>
							<div className="size-12 rounded-full">
								<img
									src={chat.profileImage || "./user.png"}
									className="object-cover"
									alt={chat.username}
								/>
							</div>
						</div>
						<h4 className="hidden md:block text-slate-200 font-medium truncate">
							{chat.username}
						</h4>
					</div>
				</div>
			))}
		</>
	);
}
