import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Image, LogOut, Volume2, VolumeOff } from "lucide-react";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

export default function ProfileHeader() {
	const { logout, authUser, updateUserProfile } = useAuthStore();
	const { isSoundEnabled, toggleSound } = useChatStore();
	const [selectedImage, setSelectedImage] = useState<null | string>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onloadend = async () => {
			// conver image to a string
			const baseImage64 = reader.result;
			if (typeof baseImage64 === "string") {
				setSelectedImage(baseImage64);
				await updateUserProfile({ profileImage: baseImage64 });
			}
		};
	};

	return (
		<div className="w-full p-4 md:p-6 border-b border-slate-700/50 mx-auto flex items-center justify-center md:justify-around">
			<div className="flex items-center gap-6">
				{/* AVATAR */}
				<div className="dropdown dropdown-start">
					<div tabIndex={0} role="button">
						<div className="avatar avatar-online">
							<div className="w-12 rounded-full">
								<img
									src={authUser?.profileImage || selectedImage || "./user.png"}
									alt={authUser?.username}
								/>
							</div>
						</div>
					</div>
					<ul
						tabIndex={0}
						className="dropdown-content menu bg-slate-900/98 backdrop-blur-sm rounded-box min-w-32 max-w-36 z-50 p-2 shadow-sm">
						<p className="text-sm text-slate-200 py-2 px-4">{authUser?.username}</p>
						<div className="divider p-0 m-0" />
						<button
							className="flex items-center justify-around mb-1 cursor-pointer hover:bg-base-content/10 py-2 rounded"
							onClick={() => {
								mouseClickSound.currentTime = 0;
								mouseClickSound.play().catch((err: unknown) => console.log(err));
								toggleSound();
							}}>
							<span>تغییر صدا</span>
							<span>
								{isSoundEnabled ?
									<Volume2 size={18} />
								:	<VolumeOff size={18} />}
							</span>
						</button>
						<button
							onClick={() => fileInputRef.current?.click()}
							className="flex items-center justify-around mb-1 cursor-pointer hover:bg-base-content/10 py-2 rounded">
							<span>تغییر تصویر</span>
							<Image size={18} />
							<input
								type="file"
								accept="image/*"
								ref={fileInputRef}
								onChange={handleImage}
								className="hidden"
							/>
						</button>
						<li className="mt-1 hover:bg-red-900 rounded">
							<button onClick={() => logout()}>خروج</button>
						</li>
					</ul>
				</div>
				<div className="hidden md:flex items-center gap-4">
					<button
						className="hover:text-cyan-600 transition-all cursor-pointer"
						onClick={() => {
							mouseClickSound.currentTime = 0;
							mouseClickSound.play().catch((err: unknown) => console.log(err));
							toggleSound();
						}}>
						{isSoundEnabled ?
							<Volume2 size={18} />
						:	<VolumeOff size={18} />}
					</button>
					<LogOut
						size={18}
						className="hover:text-red-400 transition-all cursor-pointer"
						onClick={() => logout()}
					/>
				</div>
			</div>
		</div>
	);
}
