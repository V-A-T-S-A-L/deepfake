import React from 'react';
import { Apple, Mail } from 'lucide-react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
	const [showPassword, setShowPassword] = useState(false);
	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle login logic here
	};

	return (
		<div className="min-h-screen bg-black text-black flex items-center justify-center p-4 -mt-10">
			<div className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold mb-2 text-purple-500">Welcome back</h1>
					<p className="text-gray-600">Login to your Veracity.AI account</p>
				</div>

				<div className="flex flex-col md:flex-row gap-8">
					{/* Left Column - Standard Form */}
					<div className="flex-1">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label htmlFor="email" className="text-left block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									type="email"
									id="email"
									placeholder="m@example.com"
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
								/>
							</div>

							<div>
								<div className="flex items-center justify-between mb-1">
									<label htmlFor="password" className="block text-sm font-medium text-gray-700">
										Password
									</label>
									<a href="#" className="text-sm text-gray-600 hover:text-gray-800">
										Forgot your password?
									</a>
								</div>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									>
										{showPassword ? 
											<EyeOff className="h-5 w-5" /> : 
											<Eye className="h-5 w-5" />
										}
									</button>
								</div>
							</div>

							<button
								type="submit"
								className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-400 transition-colors"
							>
								Login
							</button>
						</form>
					</div>

					{/* Right Column - Social Auth */}
					<div className="flex-1 flex flex-col justify-center">
						<div className="relative mb-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">Or login with</span>
							</div>
						</div>

						<div className="space-y-4">
							<button className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md hover:border-purple-500">
								<svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
									<path d="M17.537 12.625a4.421 4.421 0 0 0 2.684 4.047 10.96 10.96 0 0 1-1.384 2.845c-.834 1.218-1.7 2.432-3.062 2.457-1.34.025-1.77-.794-3.3-.794-1.531 0-2.01.769-3.275.82-1.316.049-2.317-1.318-3.158-2.532-1.72-2.484-3.032-7.017-1.27-10.077A4.9 4.9 0 0 1 8.91 6.884c1.292-.025 2.51.869 3.3.869.789 0 2.27-1.075 3.828-.917a4.67 4.67 0 0 1 3.66 1.984 4.524 4.524 0 0 0-2.16 3.805m-2.52-7.432A4.4 4.4 0 0 0 16.06 2a4.482 4.482 0 0 0-2.945 1.516 4.185 4.185 0 0 0-1.061 3.093 3.708 3.708 0 0 0 2.967-1.416Z" />
								</svg>
								<span>Continue with Apple</span>
							</button>
							<button className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md hover:border-purple-500">
								<svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
									<path fill-rule="evenodd" d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z" clip-rule="evenodd" />
								</svg>
								<span>Continue with Google</span>
							</button>
							<button className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md hover:border-purple-500">
								<svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
									<path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd" />
								</svg>
								<span>Continue with Facebook</span>
							</button>
						</div>
					</div>
				</div>

				<div className="mt-8 text-center">
					<p className="text-sm text-gray-600">
						Don't have an account?{' '}
						<a href="/signup" className="font-medium text-black hover:text-purple-500">
							Sign up
						</a>
					</p>

					<p className="mt-4 text-xs text-gray-500">
						By clicking continue, you agree to our{' '}
						<a href="#" className="underline">
							Terms of Service
						</a>{' '}
						and{' '}
						<a href="#" className="underline">
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;