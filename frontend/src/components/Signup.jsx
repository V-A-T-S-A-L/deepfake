import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { auth, providerGoogle, providerFacebook, providerApple } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth'; // Import necessary Firebase functions
import { sendEmailVerification } from "firebase/auth";

const Signup = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [username, setUsername] = useState(''); // State for username
	const [email, setEmail] = useState(''); // State for email
	const [password, setPassword] = useState(''); // State for password
	const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password


	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			console.error("Passwords do not match");
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			console.log('User created:', user);

			// Send verification email
			await sendEmailVerification(user);
			alert('Verification email sent! Please check your inbox.');

			// Optionally, redirect user or disable login until email is verified
		} catch (error) {
			console.error('Error during sign-up:', error.message);
		}
	};

	const handleSocialSignUp = async (provider) => {
		try {
			const result = await signInWithPopup(auth, provider);  // Use the signInWithPopup function correctly
			const user = result.user;
			console.log('Signed in user:', user);
		} catch (error) {
			console.error('Error during social sign-up:', error.message);
		}
	};

	return (
		<div className="min-h-screen bg-black text-black flex items-center justify-center p-4 lg:-mt-10">
			<div className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold mb-2 text-purple-500">Create account</h1>
					<p className="text-gray-600">Sign up for your Veracity.AI account</p>
				</div>

				<div className="flex flex-col md:flex-row gap-8">
					<div className="flex-1">
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Email Input */}
							<div>
								<label htmlFor="email" className="text-left block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="m@example.com"
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
									required
								/>
							</div>

							{/* Password Input */}
							<div>
								<label htmlFor="password" className="text-left block text-sm font-medium text-gray-700 mb-1">
									Password
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									>
										{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
									</button>
								</div>
							</div>

							{/* Confirm Password Input */}
							<div>
								<label htmlFor="confirmPassword" className="text-left block text-sm font-medium text-gray-700 mb-1">
									Confirm Password
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										id="confirmPassword"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
										required
									/>
								</div>
							</div>

							<button
								type="submit"
								className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-400 transition-colors"
							>
								Sign up
							</button>
						</form>
					</div>

					{/* Social Signup Section */}
					<div className="flex-1 flex flex-col justify-center">
						<div className="relative mb-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">Or sign up with</span>
							</div>
						</div>

						<div className="space-y-4">
							<button
								onClick={() => handleSocialSignUp(providerApple)}
								className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md hover:border-purple-500"
							>
								<span>Continue with Apple</span>
							</button>
							<button
								onClick={() => handleSocialSignUp(providerGoogle)}
								className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md hover:border-purple-500"
							>
								<span>Continue with Google</span>
							</button>
							<button
								onClick={() => handleSocialSignUp(providerFacebook)}
								className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md hover:border-purple-500"
							>
								<span>Continue with Facebook</span>
							</button>
						</div>
					</div>
				</div>

				<div className="mt-8 text-center">
					<p className="text-sm text-gray-600">
						Already have an account?{' '}
						<a href="/login" className="font-medium text-black hover:text-purple-500">
							Log in
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;
