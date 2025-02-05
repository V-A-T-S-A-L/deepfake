import React from 'react'
import { Link,useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <p className="text-center mb-6">Enter your credentials to access your account</p>
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 bg-gray-800 rounded" />
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 bg-gray-800 rounded" />
        <button className="w-full bg-purple-500 py-2 rounded-lg" onClick={() => navigate('/dashboard')}>Login</button>
        <p className="text-center mt-4">Don't have an account? <Link to="/signup" className="text-purple-500">Sign Up</Link></p>
      </div>
    </div>
  );
}

export default Login