import { type ReactNode } from "react";

export default function AnimatedBorder({ children }: { children: ReactNode }) {
	return (
		<div className="w-full [background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.cyan.500)_86%,_theme(colors.cyan.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border  overflow-hidden">
			{children}
		</div>
	);
}
