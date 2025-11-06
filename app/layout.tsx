import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import { AuthProvider } from './contexts/AuthContext'

export const metadata: Metadata = {
	title: 'Recipe Menu',
	description: 'Input and view your recipes',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<AuthProvider>
					<div className="flex min-h-screen">
						{/* Sidebar - Desktop only */}
						<aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-primary shadow-xl border-r-2 border-primary z-40 overflow-y-auto">
							<Navbar />
						</aside>
						
						{/* Main content area */}
						<div className="flex-1 md:ml-64">
							<div className="container">
								<div className="container-inner">
									{/* Mobile navbar header */}
									<div className="md:hidden sticky top-0 z-50 -mx-3 sm:-mx-6 px-3 sm:px-6 -mt-4 sm:-mt-6 backdrop-blur-md bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-navy-900 dark:via-navy-800 dark:to-navy-900 shadow-md border-b-2 border-primary/50">
										<Navbar />
									</div>
									<div className="mt-6 sm:mt-8">
										{children}
									</div>
								</div>
							</div>
						</div>
					</div>
				</AuthProvider>
			</body>
		</html>
	)
}
