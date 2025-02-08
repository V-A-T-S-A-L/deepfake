import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {

	const[userName, setUserName] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {				
				setUserName(user.displayName)	
			} else {
				navigate("/login");
			}
		});

		// Cleanup listener when component unmounts
		return () => unsubscribe();
	}, [navigate]);

	const stats = [
		{
			icon: <svg class="w-9 h-9 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
			</svg>,
			label: "Detected Deepfakes",
			value: "12"
		},
		{
			icon: <svg class="w-9 h-9 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.5 11.5 11 13l4-3.5M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z" />
			</svg>,
			label: "Accuracy Rate",
			value: "98.7%"
		},
		{
			icon: <svg class="w-9 h-9 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 6 2 2 4-4m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" />
			</svg>,
			label: "Files Analyzed",
			value: "56"
		},
	];

	const recentDetections = [
		{ id: 1, filename: "suspect_video_001.mp4", result: "Deepfake", confidence: "99.2%", date: "2023-05-15" },
		{ id: 2, filename: "analysis_clip_002.mp4", result: "Authentic", confidence: "97.8%", date: "2023-05-14" },
		{ id: 3, filename: "deepfake_test_003.mp4", result: "Deepfake", confidence: "95.5%", date: "2023-05-13" },
	];

	const detectionData = [
		{ date: "Jan", detections: 2, "deepfakes detected": 0 },
		{ date: "Feb", detections: 3, "deepfakes detected": 1 },
		{ date: "Mar", detections: 5, "deepfakes detected": 2 },
		{ date: "Apr", detections: 7, "deepfakes detected": 2 },
		{ date: "May", detections: 10, "deepfakes detected": 5 },
		{ date: "Jun", detections: 12, "deepfakes detected": 6 },
	];

	return (
		<div className="min-h-screen bg-black text-white p-6 md:p-8 w-full">
			<h1 className="text-purple-500 text-3xl md:text-4xl font-bold text-center mb-6">{userName} Veracity.AI Dashboard</h1>

			{/* Stats Section */}
			<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-6 mb-8">
				{stats.map((stat, index) => (
					<div key={index} className="bg-gray-900 hover:bg-gradient-to-r from-[#7d0088] to-purple-900 transition ease-in-out p-6 rounded-lg text-center group">
						<p className="group-hover:-translate-y-2 transition ease-in-out">{stat.icon}</p>
						<h2 className="text-white text-2xl font-semibold">{stat.value}</h2>
						<p className="text-gray-200">{stat.label}</p>
					</div>
				))}
			</div>

			{/* Chart Placeholder */}
			<div className="bg-gray-900 hover:bg-gradient-to-r from-[#7d0088] to-purple-900 transition ease-in-out rounded-lg p-6 mb-8 text-center max-w-screen mx-auto">
				<h2 className="text-white text-lg font-semibold mb-4">Detection Trend</h2>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={detectionData}>
						<CartesianGrid strokeDasharray="3 3" stroke="#666" />
						<XAxis dataKey="date" stroke="#ddd" />
						<YAxis stroke="#ddd" />
						<Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
						<Line type="monotone" dataKey="detections" stroke="#fff" strokeWidth={2} />
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* Recent Detections */}
			<div className="bg-gray-900 hover:bg-gradient-to-r from-[#7d0088] to-purple-900 transition ease-in-out rounded-lg p-6 mb-8">
				<h2 className="text-white text-lg font-semibold mb-4">Recent Detections</h2>

				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr className="border-b border-gray-700">
								<th className="p-2 text-centre text-white">Filename</th>
								<th className="p-2 text-centre text-white">Result</th>
								<th className="p-2 text-centre text-white">Confidence</th>
								<th className="p-2 text-centre text-white">Date</th>
							</tr>
						</thead>
						<tbody>
							{recentDetections.map((detection) => (
								<tr key={detection.id} className="border-b border-gray-700">
									<td className="text-centre p-2 text-gray-300">{detection.filename}</td>
									{detection.result == "Deepfake" ? (
										<td className="text-centre p-2 text-red-500">{detection.result}</td>
									) : (
										<td className="text-centre p-2 text-green-500">{detection.result}</td>
									)}
									<td className="text-centre p-2 text-gray-300">{detection.confidence}</td>
									<td className="text-centre p-2 text-gray-300">{detection.date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Upload Section */}
			<div className="bg-gray-900 hover:bg-gradient-to-r from-[#7d0088] to-purple-900 transition ease-in-out rounded-lg p-6 text-center">
				<h2 className="text-white text-lg font-semibold mb-4">Analyze New Files</h2>
				<Link to={"/home"}><button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg transition">Home</button></Link>
			</div>
		</div>
	);
};

export default Dashboard;
