import ActiveTabSwitch from "../components/ActiveTabSwitch";
import AnimatedBorder from "../components/AnimatedBorder";
import ChatContainer from "../components/chat/ChatContainer";
import ChatsList from "../components/ChatsList";
import ContactsList from "../components/ContactsList";
import NoConversationPlaceholder from "../components/chat/NoConversationPlaceholder";
import ProfileHeader from "../components/ProfileHeader";
import { useChatStore } from "../store/useChatStore";

export default function HomePage() {
	const { activeTab, selectedUser } = useChatStore();
	return (
		<div className="relative w-full max-w-6xl md:p-4">
			<AnimatedBorder>
				<div className="w-full h-[800px] flex">
					{/* Right Side */}
					<div className="md:w-60 bg-slate-800/50 flex flex-col">
						<ProfileHeader />
						<ActiveTabSwitch />
						<div className="flex-1 overflow-y-auto py-2 space-y-2">
							{activeTab === "chats" ?
								<ChatsList />
							:	<ContactsList />}
						</div>
					</div>
					{/* Left Side */}
					<div className="flex-1 flex flex-col bg-slate-900/5">
						{selectedUser ?
							<ChatContainer />
						:	<NoConversationPlaceholder />}
					</div>
				</div>
			</AnimatedBorder>
		</div>
	);
}
