import React from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import HowItWorks from './Components/HowItWorks'
import UploadSection from './Components/UploadSection'
import Pricing from './Components/Pricing'
import Footer from './Components/Footer'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Signup from './Components/Signup'
import Login from './Components/Login'
import DashBoard from './Components/DashBoard'
import ImageDetection from './Components/ImageDetection'
import VideoDetection from './Components/VideoDetection'
import AudioDetection from './Components/AudioDetection'


function App() {


	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<Hero />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/dashboard" element={<DashBoard />} />
				<Route path="/image-detection" element={<ImageDetection />} />
				<Route path="/video-detection" element={<VideoDetection />} />
				<Route path="/audio-detection" element={<AudioDetection />} />
			</Routes>
			<Footer />
		</Router>

	)
}

export default App
