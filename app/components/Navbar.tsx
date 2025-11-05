"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
	const pathname = usePathname();
	const { user, signOut } = useAuth();

	// Don't show navbar on login page
	if (pathname === "/login") {
		return null;
	}

	// Check if user is authenticated
	const isAuthenticated = !!user;

	const isActive = (path: string) => {
		return pathname === path;
	};

	if (isAuthenticated) {
		return (
			<nav className="navbar">
				<div className="navbar-nav">
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
				</div>
				<div className="navbar-actions">
					<span className="text-primary-muted text-sm">{user?.email}</span>
					<button onClick={signOut} className="btn-secondary btn-small">
						Sign Out
					</button>
				</div>
			</nav>
		);
	}

	// Public navbar (not authenticated)
	return (
		<nav className="navbar">
			<div className="navbar-nav">
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
			</div>
		</nav>
	);
}

