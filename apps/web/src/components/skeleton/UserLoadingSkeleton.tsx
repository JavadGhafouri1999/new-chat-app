export default function UserLoadingSkeleton() {
	return (
		<div className="flex max-w-32 flex-col gap-4 animate-pulse">
			<div className="flex items-center gap-2 w-full">
				<div className="skeleton size-14 shrink-0 rounded-full"></div>
				<div className="hidden md:flex flex-col gap-3">
					<div className="skeleton h-3 w-22"></div>
					<div className="skeleton h-3 w-22"></div>
				</div>
			</div>
		</div>
	);
}
