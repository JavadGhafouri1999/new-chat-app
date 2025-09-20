import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
	const { setActiveTab } = useChatStore();

	return (
		<div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
			<div className="size-12 bg-cyan-500/10 rounded-full flex items-center justify-center">
				<MessageCircleIcon className="w-8 h-8 text-cyan-400 p-1" />
			</div>
			<div>
				<h4 className="text-slate-200 font-medium mb-1">هنوز گفتگویی وجود ندارد</h4>
			</div>
			<button
				onClick={() => setActiveTab("contacts")}
				className="px-4 py-2 text-sm text-cyan-400 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors">
				پیدا کردن مخاطبین
			</button>
		</div>
	);
}
export default NoChatsFound;
