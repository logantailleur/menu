"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
	const router = useRouter();
	const { signIn, signUp } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");

		// Validate password confirmation on sign up
		if (isSignUp && password !== confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		const { error: authError } = isSignUp
			? await signUp(email, password)
			: await signIn(email, password);

		if (authError) {
			setError(authError.message);
			setLoading(false);
		} else {
			if (isSignUp) {
				setSuccess(
					"Account created! Please check your email to confirm your account before signing in."
				);
				setTimeout(() => {
					setIsSignUp(false);
					setSuccess("");
				}, 3000);
			} else {
				router.push("/");
			}
		}
		setLoading(false);
	};

	return (
		<div className="container">
			<div className="container-inner">
				<div className="card-body max-w-md mx-auto mt-8 sm:mt-12">
					<div className="text-center mb-6">
						<h1 className="heading-2 mb-2">
							{isSignUp ? "Create Account" : "Welcome Back"}
						</h1>
						<p className="text-primary-muted text-sm">
							{isSignUp
								? "Sign up to start managing your recipes"
								: "Sign in to your account"}
						</p>
					</div>

					{error && <div className="alert-error">{error}</div>}

					{success && <div className="alert-success">{success}</div>}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="email" className="label">
								Email{" "}
								<span className="required-asterisk">*</span>
							</label>
							<input
								type="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="input"
								placeholder="your@email.com"
							/>
						</div>

						<div>
							<label htmlFor="password" className="label">
								Password{" "}
								<span className="required-asterisk">*</span>
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
									className="input pr-10"
									placeholder="••••••••"
									minLength={6}
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-muted hover:text-primary transition-colors"
									aria-label={
										showPassword
											? "Hide password"
											: "Show password"
									}
								>
									{showPassword ? (
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
											/>
										</svg>
									) : (
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									)}
								</button>
							</div>
							{isSignUp && (
								<p className="text-primary-muted text-xs mt-1">
									Must be at least 6 characters
								</p>
							)}
						</div>

						{isSignUp && (
							<div>
								<label
									htmlFor="confirmPassword"
									className="label"
								>
									Confirm Password{" "}
									<span className="required-asterisk">*</span>
								</label>
								<div className="relative">
									<input
										type={
											showConfirmPassword
												? "text"
												: "password"
										}
										id="confirmPassword"
										value={confirmPassword}
										onChange={(e) =>
											setConfirmPassword(e.target.value)
										}
										required
										className="input pr-10"
										placeholder="••••••••"
										minLength={6}
									/>
									<button
										type="button"
										onClick={() =>
											setShowConfirmPassword(
												!showConfirmPassword
											)
										}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-muted hover:text-primary transition-colors"
										aria-label={
											showConfirmPassword
												? "Hide password"
												: "Show password"
										}
									>
										{showConfirmPassword ? (
											<svg
												className="w-5 h-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
												/>
											</svg>
										) : (
											<svg
												className="w-5 h-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
										)}
									</button>
								</div>
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className={`btn-primary btn-full w-full ${
								isSignUp
									? "bg-secondary hover:bg-secondary-hover border-secondary hover:border-action-600"
									: ""
							}`}
						>
							{loading
								? "Loading..."
								: isSignUp
								? "Sign Up"
								: "Sign In"}
						</button>
					</form>

					<div className="mt-6 text-center">
						<button
							type="button"
							onClick={() => {
								setIsSignUp(!isSignUp);
								setError("");
								setSuccess("");
								setPassword("");
								setConfirmPassword("");
							}}
							className="text-primary-muted hover:text-primary text-sm transition-colors"
						>
							{isSignUp
								? "Already have an account? Sign in"
								: "Don't have an account? Sign up"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
