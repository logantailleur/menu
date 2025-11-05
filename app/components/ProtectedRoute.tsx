"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push('/login');
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center z-40">
				<LoadingSpinner />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
}

