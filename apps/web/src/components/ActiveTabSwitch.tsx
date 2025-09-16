import { MessageCircleMore, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

export default function ActiveTabSwitch() {
	const { activeTab, setActiveTab } = useChatStore();
	return (
		<div className="flex items-center justify-around py-2 px-2 w-full tabs tabs-box bg-transparent rounded-none border-none">
			<button
				className={`tab ${activeTab === "chats" ? " bg-cyan-500/20 text-cyan-300" : "text-slate-300"}`}
				onClick={() => setActiveTab("chats")}>
				<span className="hidden md:block">گفتگوها</span>
				<Users className="block md:hidden" size={18} />
			</button>
			<button
				className={`tab ${activeTab === "contacts" ? " bg-cyan-500/20 text-cyan-300" : "text-slate-300"}`}
				onClick={() => setActiveTab("contacts")}>
				<span className="hidden md:block">مخاطبین</span>
				<MessageCircleMore className="block md:hidden" size={18} />
			</button>
		</div>
	);
}
