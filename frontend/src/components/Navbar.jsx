import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return  (
    <nav className="flex justify-between items-center p-4 bg-black text-white">
    <h1 className="text-xl font-bold text-purple-500">DeepFake Detector</h1>
    <div className="space-x-4">
      <Link to="/signup"><button className="bg-purple-500 px-4 py-2 rounded-lg">Sign Up</button></Link>
      <Link to="/login"><button className="border px-4 py-2 rounded-lg">Login</button></Link>
    </div>
  </nav>
  );
}

export default Navbar