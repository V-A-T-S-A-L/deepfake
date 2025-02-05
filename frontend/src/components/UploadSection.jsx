import React from 'react'

const UploadSection = () => {
  return (
    <section className="text-center py-20 bg-black text-white w-full">
    <h2 className="text-3xl font-bold mb-6">Try It Now</h2>
    <div className="border p-6 rounded-lg bg-gray-900 w-1/2 mx-auto">
      <input type="file" className="block w-full mb-4 text-white" />
      <button className="bg-purple-500 px-6 py-3 rounded-lg w-full">Analyze</button>
    </div>
  </section>
  )
}

export default UploadSection