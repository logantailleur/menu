"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function LayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isLoginPage = pathname === "/login";

	return (
		<div className="flex min-h-screen">
			{/* Sidebar - Desktop only, hidden on login page */}
			{!isLoginPage && (
				<aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-primary shadow-xl border-r-2 border-primary z-40 overflow-y-auto">
					<Navbar />
				</aside>
			)}

			{/* Main content area */}
			<div className={`flex-1 ${!isLoginPage ? "md:ml-64" : ""}`}>
				<div className="container">
					<div className="container-inner">
						{/* Mobile navbar header - hidden on login page */}
						{!isLoginPage && (
							<div className="md:hidden sticky top-0 z-50 -mx-3 sm:-mx-6 px-3 sm:px-6 -mt-4 sm:-mt-6 backdrop-blur-md bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-navy-900 dark:via-navy-800 dark:to-navy-900 shadow-md border-b-2 border-primary/50">
								<Navbar />
							</div>
						)}
						<div className="mt-6 sm:mt-8">{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
