"use client";

interface LoadingSpinnerProps {
	object?: string;
	className?: string;
}

export default function LoadingSpinner({ object, className = "" }: LoadingSpinnerProps) {
	return (
		<div className={`spinner-container ${className}`}>
			<div className="relative w-12 h-12">
				<div className="spinner-ring"></div>
				<div className="spinner-spin"></div>
			</div>
			{object && (
				<p className="text-center text-primary-muted font-medium">
					Loading {object}
				</p>
			)}
		</div>
	);
}

