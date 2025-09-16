import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import NoChatsFound from "./NoChatsFound";
import UserLoadingSkeleton from "./skeleton/UserLoadingSkeleton";

export default function ContactsList() {
	const { getAllContacts, allContact, isUsersLoading, setSelectedUser } = useChatStore();

	useEffect(() => {
		getAllContacts();
	}, [getAllContacts]);

	if (isUsersLoading) return <UserLoadingSkeleton />;
	if (allContact.length === 0) return <NoChatsFound />;
	return (
		<>
			{allContact.map((constact) => (
				<div
					key={constact._id}
					className="md:bg-cyan-500/10 md:p-3 rounded-lg cursor-pointer md:hover:bg-cyan-500/30 transition-colors flex items-center justify-center w-full"
					onClick={() => setSelectedUser(constact)}>
					<div className="flex items-center justify-between md:w-full gap-3">
						<div className={`avatar avatar-online`}>
							<div className="size-12 rounded-full">
								<img
									src={constact.profileImage || "./user.png"}
									className="object-cover"
									alt={constact.username}
								/>
							</div>
						</div>
						<h4 className="hidden md:block text-slate-200 font-medium truncate">
							{constact.username}
						</h4>
					</div>
				</div>
			))}
		</>
	);
}
