"use client"

import { useState, useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";
import TextPressure from './TextPressure';
import SpotlightCard from './SpotlightCard';
import TiltedCard from './TiltedCard';
import cardBg from '../assets/image.png';

export default function Hero() {
	const [email, setEmail] = useState("")
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault()
		// Handle email submission logic here
		console.log("Submitted email:", email)
		setEmail("")
	}

	return (
		<div className="min-h-screen bg-black text-gray-100">
			{/* Hero Section with 3D Spline Model */}
			<section className="relative h-screen bg-black text-white overflow-hidden">
				<div className="absolute inset-0">
					<Spline scene="https://prod.spline.design/adyDjs1G39aYIUgG/scene.splinecode" />
				</div>

				<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30"></div>

				<div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
					<div className="relative h-24 w-96 ">
						<TextPressure
							text="Veracity.AI"
							flex={true}
							alpha={false}
							stroke={false}
							width={true}
							weight={true}
							italic={true}
							textColor="#ffffff"
							strokeColor="#ff0000"
							minFontSize={24}
							className="transition-colors duration-300 ease-in-out group-hover:text-purple-500 group-hover:stroke-purple-500"
						/>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
						Unveil the Truth Behind <span className="text-purple-400">DeepFakes</span>
					</h1>
					<p className="text-xl mb-8 text-purple-200 max-w-2xl">
						Our cutting-edge AI technology empowers you to identify manipulated videos and images with unparalleled accuracy.
					</p>
					<a
						href="/home"
						className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition duration-300 inline-block"
					>
						Detect Now
					</a>
				</div>
			</section>


			{/* Features Section */}
			<section id="features" className="bg-gradient-to-b from-black to-[#000] py-24 relative">
				<div className="container mx-auto px-6 text-center">
					<h2 className="text-5xl font-extrabold text-white mb-16 tracking-wide relative inline-block before:absolute before:-bottom-2 before:left-1/2 before:w-16 before:h-1 before:bg-yellow-400 before:transform before:-translate-x-1/2">
						Discover Our Features
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						{[
							{
								title: "Unmatched Accuracy",
								description: "Experience industry-leading precision in deepfake detection.",
								icon: "🎯",
							},
							{
								title: "Lightning Speed",
								description: "Real-time processing for instant verification results.",
								icon: "⚡",
							},
							{
								title: "Seamless Experience",
								description: "A beautifully designed interface for effortless navigation.",
								icon: "✨",
							},
						].map((feature, index) => (
							<SpotlightCard
								key={index}
								spotlightColor="#ff9fff"
								className="group transform transition duration-300 hover:-translate-y-2"
							>
								<div className="text-6xl text-yellow-400 mb-6 transform transition duration-300 group-hover:rotate-12">
									{feature.icon}
								</div>
								<h3 className="text-2xl font-semibold text-white mb-4 text-center group-hover:text-yellow-400 transition-all duration-300">
									{feature.title}
								</h3>
								<p className="text-gray-300 text-center group-hover:text-gray-100 transition-all duration-300">
									{feature.description}
								</p>
							</SpotlightCard>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<div className="pricing-section py-12 bg-black">
				<h2 className="text-5xl font-extrabold text-white mb-16 tracking-wide relative">Pricing Plans</h2>
				<div className="container mx-auto px-16 grid grid-cols-1 md:px-56 md:grid-cols-3 gap-12">
					<TiltedCard
						imageSrc={cardBg}
						altText="Kendrick Lamar - GNX Album Cover"
						captionText="Basic Plan"
						containerHeight="300px"
						containerWidth=""
						imageHeight="300px"
						imageWidth="300px"
						rotateAmplitude={12}
						scaleOnHover={1.2}
						showMobileWarning={false}
						showTooltip={true}
						displayOverlayContent={true}
						overlayContent={
							<div className="pricing-details bg-transparent border-0 border-purple-500 p-4 rounded-lg text-center">
								<h3 className="text-left text-xl font-semibold mb-2">Basic Plan</h3>
								<p className="text-lg text-left text-gray-400 mb-4">$0.00/month</p>
								<ul className="text-left space-y-2">
									<li>25 analyses per month</li>
									<li>Basic Report</li>
									<li>No API access</li>
								</ul>
							</div>
						}
					/>
					<TiltedCard
						imageSrc={cardBg}
						altText="Kendrick Lamar - GNX Album Cover"
						captionText="Premium Plan"
						containerHeight="300px"
						containerWidth=""
						imageHeight="300px"
						imageWidth="300px"
						rotateAmplitude={12}
						scaleOnHover={1.2}
						showMobileWarning={false}
						showTooltip={true}
						displayOverlayContent={true}
						overlayContent={
							<div className="pricing-details bg-transparent border-0 border-purple-500 p-4 rounded-lg text-center">
								<h3 className="text-left text-xl font-semibold mb-2">Premium Plan</h3>
								<p className="text-lg text-left text-gray-400 mb-4">$5.99/month</p>
								<ul className="text-left space-y-2">
									<li>Unlimited analyses</li>
									<li>Detailed Report</li>
									<li>Limited API access</li>
								</ul>
							</div>
						}
					/>
					<TiltedCard
						imageSrc={cardBg}
						altText="Kendrick Lamar - GNX Album Cover"
						captionText="Enterprise Plan"
						containerHeight="300px"
						containerWidth=""
						imageHeight="300px"
						imageWidth="300px"
						rotateAmplitude={12}
						scaleOnHover={1.2}
						showMobileWarning={false}
						showTooltip={true}
						displayOverlayContent={true}
						overlayContent={
							<div className="pricing-details bg-transparent border-0 border-purple-500 p-4 rounded-lg text-center">
								<h3 className="text-xl font-semibold text-left mb-2">Enterprise Plan</h3>
								<p className="text-lg text-left text-gray-400 mb-4">$49.99/month</p>
								<ul className="text-left space-y-2">
									<li>Unlimited analyses</li>
									<li>Detailed Report</li>
									<li>Unlimited API access</li>
									<li>Dedicated Support</li>
									<li>Custom Solutions</li>
								</ul>
							</div>
						}
					/>
				</div>
			</div>
			{/* Call to Action Section */}
			<section id="contact" className="relative bg-gradient-to-b from-black to-[#340258] py-24 px-6">
				<div className="container mx-auto text-center">
					<h2 className="text-5xl font-extrabold text-white mb-6 tracking-wide relative">
						Get In Touch
					</h2>
					<p className="text-gray-400 max-w-xl mx-auto mb-12">
						Have questions or need support? Reach out to us—we'd love to hear from you!
					</p>

					<div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
						{/* Contact Form */}
						<div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border-2 border-transparent animate-border">
							<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
								<input
									type="text"
									placeholder="Your Name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
									required
								/>
								<input
									type="email"
									placeholder="Your Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
									required
								/>
								<textarea
									rows="4"
									placeholder="Your Message"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
									required
								></textarea>
								<button
									type="submit"
									className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-300"
								>
									Send Message
								</button>
							</form>
						</div>

						{/* Contact Details */}
						<div className="flex flex-col space-y-6 text-right">
							<div className="flex items-center space-x-4">
								<span className="text-purple-400 text-2xl"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
									<path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
								</svg>
								</span>
								<a href="mailto:contact@yourwebsite.com" className="text-gray-300 hover:text-white transition">
									veracityai@gmail.com
								</a>
							</div>
							<div className="flex items-center space-x-4">
								<span className="text-purple-400 text-2xl"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z" />
								</svg>
								</span>
								<p className="text-gray-300">Bandra, Mumbai, India</p>
							</div>
							<div className="flex items-center space-x-4">
								<span className="text-purple-400 text-2xl"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z" />
								</svg>
								</span>
								<a href="tel:+1234567890" className="text-gray-300 hover:text-white transition">
									+123 456 7890
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

