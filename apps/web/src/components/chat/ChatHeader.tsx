import { XIcon } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export default function ChatHeader() {
	const { selectedUser, setSelectedUser } = useChatStore();
	const { onlineUsers } = useAuthStore();

	const isOnline = selectedUser && onlineUsers.includes(selectedUser?._id);

	useEffect(() => {
		const handleEscKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setSelectedUser(null);
			}
		};

		window.addEventListener("keydown", handleEscKey);

		return () => window.removeEventListener("keydown", handleEscKey);
	}, [setSelectedUser]);

	return (
		<div className="flex-1 flex items-center justify-between bg-slate-800/50 border-b border-slate-700/50 max-h-[65px] min-h-[65px] px-5">
			<div className="flex items-center space-x-3">
				<div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
					<div className="size-10  rounded-full overflow-hidden">
						<img
							src={selectedUser?.profileImage || "./user.png"}
							alt={selectedUser?.username}
							className="object-cover"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<div className="text-slate-200 font-medium">{selectedUser?.username}</div>
					<p className={`text-xs  ${isOnline ? "text-emerald-400" : "text-red-400"}`}>
						{isOnline ? "آنلاین" : "آفلاین"}
					</p>
				</div>
			</div>
			<button className="cursor-pointer" onClick={() => setSelectedUser(null)}>
				<XIcon className="size-5 md:size-6 text-slate-400 hover:text-red-400 transition-colors" />
			</button>
		</div>
	);
}
