import React from 'react'
import { Link } from 'react-router-dom'

const DashBoard = () => {
  return (
    <div >
    <nav className="flex justify-between items-center p-4 bg-black text-white">
        <h1 className="text-xl font-bold text-purple-500">DeepFake Detector</h1>
        <div className="space-x-4">
          <Link to="/login"><button className="bg-purple-500 px-4 py-2 rounded-lg">Back</button></Link>
          <Link to="/login"><button className="border px-4 py-2 rounded-lg">Logout</button></Link>
        </div>
      </nav>
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
    <h2 className="text-3xl font-bold mb-6">Choose Detection Type</h2>
    <div className="flex gap-8">
      <Link to="/image-detection"><div className="bg-gray-900 p-6 rounded-lg text-center w-64 h-48 flex items-center justify-center border-2 border-purple-500 hover:bg-purple-700 transition duration-300 cursor-pointer">Image Detection</div></Link>
      <Link to="/video-detection"><div className="bg-gray-900 p-6 rounded-lg text-center w-64 h-48 flex items-center justify-center border-2 border-purple-500 hover:bg-purple-700 transition duration-300 cursor-pointer">Video Detection</div></Link>
      <Link to="/audio-detection"><div className="bg-gray-900 p-6 rounded-lg text-center w-64 h-48 flex items-center justify-center border-2 border-purple-500 hover:bg-purple-700 transition duration-300 cursor-pointer">Audio Detection</div></Link>
    </div>
  </div>
  </div>
  )
}

export default DashBoard