export default function LoadingPage() {
	return (
		<div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
			{/* Decorators -grid and glow */}
			<div className="absolute inset-0 h-full w-full bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
			<div className="absolute top-0 left-24 size-96 bg-pink-500 opacity-20 blur-[100px]" />
			<div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] animate-pulse ease-in-out [animation-duration:7s]" />
			<span className="loading loading-infinity size-36 z-10 text-transparent text-clip bg-gradient-to-l from-cyan-400 via-indigo-300 to-pink-400" />
		</div>
	);
}
