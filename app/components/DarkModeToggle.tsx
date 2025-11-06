"use client";

import { useEffect, useState } from "react";

interface DarkModeToggleProps {
	className?: string;
	variant?: "sidebar" | "floating";
}

export default function DarkModeToggle({
	className = "",
	variant = "floating",
}: DarkModeToggleProps) {
	const [mounted, setMounted] = useState(false);
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Check for saved theme preference or default to light mode
		const isDark = localStorage.getItem("darkMode") === "true";
		setDarkMode(isDark);
		if (isDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	const toggleDarkMode = () => {
		const newDarkMode = !darkMode;
		setDarkMode(newDarkMode);
		localStorage.setItem("darkMode", newDarkMode.toString());

		if (newDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return null;
	}

	const baseClasses =
		variant === "sidebar"
			? "p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors border-2 border-transparent hover:border-slate-200 dark:hover:border-action-500/30 w-full flex items-center justify-center gap-2"
			: "fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-50 p-2.5 sm:p-3 rounded-full bg-primary backdrop-blur-sm shadow-lg border-2 border-primary active:scale-95 hover:scale-110 transition-all duration-300 touch-manipulation hover:border-secondary";

	return (
		<button
			onClick={toggleDarkMode}
			className={`${baseClasses} ${className}`}
			aria-label="Toggle dark mode"
		>
			{darkMode ? (
				<svg
					className="w-5 h-5 sm:w-6 sm:h-6 text-secondary"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			) : (
				<svg
					className="w-5 h-5 sm:w-6 sm:h-6 text-primary-muted"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</svg>
			)}
			{variant === "sidebar" && (
				<span className="text-sm text-slate-700 dark:text-action-300">
					{darkMode ? "Light Mode" : "Dark Mode"}
				</span>
			)}
		</button>
	);
}
