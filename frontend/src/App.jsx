import React from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import DashBoard from './components/DashBoard'
import HomePage from './components/Home'

function App() {


	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<Hero />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<Login />} />
				<Route path="/dashboard" element={<DashBoard />} />
				<Route path="/home" element={<HomePage />}/>
			</Routes>
			<Footer />
		</Router>

	)
}

export default App
