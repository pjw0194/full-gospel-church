"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTransition } from "./TransitionProvider";

export default function PageTransition({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isExiting } = useTransition();
	const pathname = usePathname();

	return (
		<motion.div
			key={pathname}
			initial={{ opacity: 0, y: 20 }}
			animate={{
				opacity: isExiting ? 0 : 1,
				y: isExiting ? -20 : 0,
			}}
			transition={{ duration: 0.5, ease: "easeInOut" }}
			className="w-full"
		>
			{children}
		</motion.div>
	);
}
