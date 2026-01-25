"use client";

import React from "react";
import { useTransition } from "./TransitionProvider";

interface TransitionLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
	children: React.ReactNode;
}

export default function TransitionLink({
	href,
	children,
	className,
	onClick,
	...props
}: TransitionLinkProps) {
	const { navigate } = useTransition();

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (onClick) onClick(e);

		// Allow default behavior for external links or hash links or modifiers
		if (
			href.startsWith("http") ||
			href.startsWith("#") ||
			e.metaKey ||
			e.ctrlKey ||
			e.altKey ||
			e.shiftKey
		) {
			return;
		}

		e.preventDefault();
		navigate(href);
	};

	return (
		<a href={href} className={className} onClick={handleClick} {...props}>
			{children}
		</a>
	);
}
