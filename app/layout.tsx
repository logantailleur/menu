import type { Metadata } from 'next'
import './globals.css'
import LayoutWrapper from './components/LayoutWrapper'
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
					<LayoutWrapper>
						{children}
					</LayoutWrapper>
				</AuthProvider>
			</body>
		</html>
	)
}
