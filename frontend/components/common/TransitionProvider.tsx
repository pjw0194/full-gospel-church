"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const TransitionContext = createContext<{
	navigate: (href: string) => Promise<void>;
	isExiting: boolean;
}>({
	navigate: async () => {},
	isExiting: false,
});

export const useTransition = () => useContext(TransitionContext);

export default function TransitionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [isExiting, setIsExiting] = useState(false);

	useEffect(() => {
		setIsExiting(false);
	}, [pathname]);

	const navigate = async (href: string) => {
		if (href === pathname) return;
		setIsExiting(true);
		await new Promise((r) => setTimeout(r, 500));
		router.push(href);
	};

	return (
		<TransitionContext.Provider value={{ navigate, isExiting }}>
			{children}
		</TransitionContext.Provider>
	);
}
