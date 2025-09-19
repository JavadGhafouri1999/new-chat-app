function MessagesLoadingSkeleton() {
	return (
		<div className="w-full mx-auto space-y-6 px-4">
			{[...Array(6)].map((_, index) => (
				<div
					key={index}
					className={`chat ${index % 2 !== 0 ? "chat-start" : "chat-end"} animate-pulse ltr`}
					style={{ transform: "scaleX(-1)" }}>
					<div className={`chat-bubble bg-slate-700 text-white w-32 h-10`}></div>
				</div>
			))}
		</div>
	);
}
export default MessagesLoadingSkeleton;
