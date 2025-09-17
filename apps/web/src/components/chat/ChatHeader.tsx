import { XIcon } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect } from "react";

export default function ChatHeader() {
	const { selectedUser, setSelectedUser } = useChatStore();

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
		<div className="flex-1 flex items-center justify-between bg-slate-800/50 border-b border-slate-700/50 max-h-[85px] px-5 py-2">
			<div className="flex items-center space-x-3">
				<div className="avatar avatar-online">
					<div className="size-12  rounded-full overflow-hidden">
						<img
							src={selectedUser?.profileImage || "./user.png"}
							alt={selectedUser?.username}
							className="object-cover"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<div className="text-slate-200 font-medium">{selectedUser?.username}</div>
					<p className="text-xs text-emerald-400">آنلاین</p>
				</div>
			</div>
			<button className="cursor-pointer" onClick={() => setSelectedUser(null)}>
				<XIcon className="size-5 text-slate-400 hover:text-red-400 transition-colors" />
			</button>
		</div>
	);
}
