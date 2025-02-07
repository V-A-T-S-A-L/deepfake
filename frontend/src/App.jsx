import React from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import UploadSection from './components/UploadSection'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import DashBoard from './components/DashBoard'
import ImageDetection from './components/ImageDetection'
import VideoDetection from './components/VideoDetection'
import AudioDetection from './components/AudioDetection'

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
