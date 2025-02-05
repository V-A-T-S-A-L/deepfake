import React from 'react'

const HowItWorks = () => {
  return (
    <section className="text-center py-20 bg-black text-white w-full">
    <h2 className="text-3xl font-bold mb-6">How It Works</h2>
    <div className="grid grid-cols-3 gap-4 w-full px-10">
      <div className="border p-6 rounded-lg bg-gray-900">
        <h3 className="text-xl font-semibold">Upload</h3>
        <p>Upload your media file to our secure platform.</p>
      </div>
      <div className="border p-6 rounded-lg bg-gray-900">
        <h3 className="text-xl font-semibold">Analyze</h3>
        <p>Our AI algorithms analyze the media for manipulation.</p>
      </div>
      <div className="border p-6 rounded-lg bg-gray-900">
        <h3 className="text-xl font-semibold">Results</h3>
        <p>Receive a detailed report on the authenticity of your media.</p>
      </div>
    </div>
  </section>
  )
}

export default HowItWorks