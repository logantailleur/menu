"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
	const pathname = usePathname();
	const { user, signOut } = useAuth();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	// Ensure we're on client side for portal
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Don't show navbar on login page
	if (pathname === "/login") {
		return null;
	}

	// Close mobile menu when route changes
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	// Prevent body scroll when menu is open
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);

	// Check if user is authenticated
	const isAuthenticated = !!user;

	const isActive = (path: string) => {
		return pathname === path;
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	if (isAuthenticated) {
		return (
			<>
				{/* Desktop Sidebar */}
				<div className="hidden md:flex flex-col h-full p-4">
					{/* User info */}
					<div className="mb-6 pb-4 border-b-2 border-primary">
						<span className="text-primary-muted text-sm">
							{user?.email}
						</span>
					</div>

					{/* Navigation Links */}
					<nav className="flex flex-col gap-2 flex-1">
						<Link
							href="/"
							className={isActive("/") ? "nav-link-active" : "nav-link"}
						>
							View Recipes
						</Link>
						<Link
							href="/add"
							className={isActive("/add") ? "nav-link-active" : "nav-link"}
						>
							Add Recipe
						</Link>
						<Link
							href="/ingredients"
							className={
								isActive("/ingredients") ? "nav-link-active" : "nav-link"
							}
						>
							Ingredients
						</Link>
						<Link
							href="/public"
							className={isActive("/public") ? "nav-link-active" : "nav-link"}
						>
							Public Recipes
						</Link>
					</nav>

					{/* Dark Mode Toggle */}
					<div className="mt-auto mb-4">
						<DarkModeToggle variant="sidebar" />
					</div>

					{/* Sign Out Button */}
					<div className="pt-4 border-t-2 border-primary">
						<button onClick={signOut} className="btn-secondary btn-small w-full">
							Sign Out
						</button>
					</div>
				</div>

				{/* Mobile Navbar Header */}
				<nav className="navbar md:hidden">
					<div className="flex w-full justify-between items-center">
						<button
							onClick={toggleMobileMenu}
							className="mobile-menu-button p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors border-2 border-transparent hover:border-slate-200 dark:hover:border-action-500/30"
							aria-label="Toggle menu"
						>
							{isMobileMenuOpen ? (
								<X className="w-6 h-6 text-slate-700 dark:text-action-300" />
							) : (
								<Menu className="w-6 h-6 text-slate-700 dark:text-action-300" />
							)}
						</button>
						<div className="navbar-actions">
							<button onClick={signOut} className="btn-secondary btn-small">
								Sign Out
							</button>
						</div>
					</div>
				</nav>

				{/* Mobile Menu - Rendered via Portal */}
				{isMobileMenuOpen &&
					isMounted &&
					createPortal(
						<>
							{/* Backdrop */}
							<div
								className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
								onClick={() => setIsMobileMenuOpen(false)}
							/>
							{/* Menu */}
							<div className="mobile-menu fixed inset-y-0 left-0 w-64 bg-primary shadow-xl z-[9999] md:hidden overflow-y-auto">
								<div className="flex flex-col h-full p-4">
									{/* User info */}
									<div className="mb-6 pb-4 border-b-2 border-primary">
										<span className="text-primary-muted text-sm">
											{user?.email}
										</span>
									</div>

									{/* Navigation Links */}
									<nav className="flex flex-col gap-2 flex-1">
										<Link
											href="/"
											className={
												isActive("/") ? "nav-link-active" : "nav-link"
											}
											onClick={() => setIsMobileMenuOpen(false)}
										>
											View Recipes
										</Link>
										<Link
											href="/add"
											className={
												isActive("/add") ? "nav-link-active" : "nav-link"
											}
											onClick={() => setIsMobileMenuOpen(false)}
										>
											Add Recipe
										</Link>
										<Link
											href="/ingredients"
											className={
												isActive("/ingredients")
													? "nav-link-active"
													: "nav-link"
											}
											onClick={() => setIsMobileMenuOpen(false)}
										>
											Ingredients
										</Link>
										<Link
											href="/public"
											className={
												isActive("/public") ? "nav-link-active" : "nav-link"
											}
											onClick={() => setIsMobileMenuOpen(false)}
										>
											Public Recipes
										</Link>
									</nav>

									{/* Dark Mode Toggle */}
									<div className="mt-auto mb-4">
										<DarkModeToggle variant="sidebar" />
									</div>
								</div>
							</div>
						</>,
						document.body
					)}
			</>
		);
	}

	// Public navbar (not authenticated)
	return (
		<>
			{/* Desktop Sidebar */}
			<div className="hidden md:flex flex-col h-full p-4">
				{/* Navigation Links */}
				<nav className="flex flex-col gap-2 flex-1">
					<Link
						href="/public"
						className={isActive("/public") ? "nav-link-active" : "nav-link"}
					>
						Public Recipes
					</Link>
					<Link
						href="/login"
						className={isActive("/login") ? "nav-link-active" : "nav-link"}
					>
						Sign In
					</Link>
				</nav>

				{/* Dark Mode Toggle */}
				<div className="mt-auto">
					<DarkModeToggle variant="sidebar" />
				</div>
			</div>

			{/* Mobile Navbar Header */}
			<nav className="navbar md:hidden">
				<div className="flex w-full justify-between items-center">
					<button
						onClick={toggleMobileMenu}
						className="mobile-menu-button p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors border-2 border-transparent hover:border-slate-200 dark:hover:border-action-500/30"
						aria-label="Toggle menu"
					>
						{isMobileMenuOpen ? (
							<X className="w-6 h-6 text-slate-700 dark:text-action-300" />
						) : (
							<Menu className="w-6 h-6 text-slate-700 dark:text-action-300" />
						)}
					</button>
				</div>
			</nav>

			{/* Mobile Menu - Rendered via Portal */}
			{isMobileMenuOpen &&
				isMounted &&
				createPortal(
					<>
						{/* Backdrop */}
						<div
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
							onClick={() => setIsMobileMenuOpen(false)}
						/>
						{/* Menu */}
						<div className="mobile-menu fixed inset-y-0 left-0 w-64 bg-primary shadow-xl z-[9999] md:hidden overflow-y-auto">
							<div className="flex flex-col h-full p-4">
								{/* Navigation Links */}
								<nav className="flex flex-col gap-2 flex-1">
									<Link
										href="/public"
										className={
											isActive("/public") ? "nav-link-active" : "nav-link"
										}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Public Recipes
									</Link>
									<Link
										href="/login"
										className={
											isActive("/login") ? "nav-link-active" : "nav-link"
										}
										onClick={() => setIsMobileMenuOpen(false)}
									>
										Sign In
									</Link>
								</nav>

								{/* Dark Mode Toggle */}
								<div className="mt-auto">
									<DarkModeToggle variant="sidebar" />
								</div>
							</div>
						</div>
					</>,
					document.body
				)}
		</>
	);
}

