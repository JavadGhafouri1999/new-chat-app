import { useRef, useState } from "react";
import useKeyboardSound from "../../hooks/useKeyboardSound";
import { useChatStore } from "../../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

export default function MessageInput() {
	const { sendMessageData, isSoundEnabled } = useChatStore();
	const { playRandomKeyStrokeSound } = useKeyboardSound();

	const [text, setText] = useState("");
	const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim() && !imagePreview) return toast.error("پیام خالی قابل ارسال نیست");
		if (isSoundEnabled) playRandomKeyStrokeSound();

		sendMessageData({
			text: text.trim(),
			image: imagePreview,
		});
		setText("");
		setImagePreview(undefined);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file?.type.startsWith("image/")) {
			toast.error("لطفا یک فایل تصویری انتخاب کنید.");
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onloadend = async () => {
			// conver image to a string
			const baseImage64 = reader.result;
			if (typeof baseImage64 === "string") {
				setImagePreview(baseImage64);
			}
		};
	};

	const removeImage = () => {
		setImagePreview(undefined);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="py-4 px-1 border-t border-slate-700">
			{imagePreview && (
				<div className="max-w-3xl mx-auto mb-3 flex items-center">
					<div className="relative">
						<img
							src={imagePreview}
							alt="Preview"
							className="size-20 object-cover rounded-lg border border-slate-700"
						/>
						<button
							onClick={removeImage}
							className="absolute -top-2 -right-2 size-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 transition-all"
							type="button">
							<XIcon className="size-4" />
						</button>
					</div>
				</div>
			)}
			<form onSubmit={handleSendMessage} className="flex space-x-1 mx-auto">
				<input
					type="text"
					value={text}
					onChange={(e) => {
						setText(e.target.value);
						if (isSoundEnabled) {
							playRandomKeyStrokeSound();
						}
					}}
					className="w-full flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
					placeholder="متن پیام شما"
				/>
				<input
					type="file"
					accept="image/*"
					ref={fileInputRef}
					onChange={handleImageChange}
					className="hidden"
				/>
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-3 md:px-4 transition-colors ${
						imagePreview ? "text-cyan-500" : ""
					}`}>
					<ImageIcon className="size-4" />
				</button>
				<button
					type="submit"
					disabled={!text.trim() && !imagePreview}
					className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-3 md:px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
					<SendIcon className="size-4" />
				</button>
			</form>
		</div>
	);
}
