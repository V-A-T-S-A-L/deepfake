import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
    <div className="bg-gray-900 p-8 rounded-lg w-96">
      <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
      <p className="text-center mb-6">Create an account to get started</p>
      <input type="text" placeholder="Full Name" className="w-full p-2 mb-4 bg-gray-800 rounded" />
      <input type="email" placeholder="Email" className="w-full p-2 mb-4 bg-gray-800 rounded" />
      <input type="password" placeholder="Password" className="w-full p-2 mb-4 bg-gray-800 rounded" />
      <input type="password" placeholder="Confirm Password" className="w-full p-2 mb-4 bg-gray-800 rounded" />
      <button className="w-full bg-purple-500 py-2 rounded-lg">Sign Up</button>
      <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-purple-500">Login</Link></p>
    </div>
  </div>
  )
}

export default Signup