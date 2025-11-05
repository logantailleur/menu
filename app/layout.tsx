import type { Metadata } from 'next'
import './globals.css'
import DarkModeToggle from './components/DarkModeToggle'
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
					<DarkModeToggle />
					<div className="container">
						<div className="container-inner">
							<div className="sticky top-0 z-50 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 -mt-4 sm:-mt-6 lg:-mt-8 backdrop-blur-md bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-navy-900 dark:via-navy-800 dark:to-navy-900 shadow-md border-b-2 border-primary/50">
								<Navbar />
							</div>
							<div className="mt-6 sm:mt-8">
								{children}
							</div>
						</div>
					</div>
				</AuthProvider>
			</body>
		</html>
	)
}
