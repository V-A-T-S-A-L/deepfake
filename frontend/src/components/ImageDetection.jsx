import React,{ useState, useRef }  from 'react'
import { Link } from 'react-router-dom';

const ImageDetection = () => {
   const [audioFile, setAudioFile] = useState(null);
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setAudioFile(URL.createObjectURL(file));
      }
    };
  return (
    <div>
    <nav className="flex justify-between items-center p-4 bg-black text-white">
    <h1 className="text-xl font-bold text-purple-500">DeepFake Detector</h1>
    <div className="space-x-4">
      <Link to="/dashboard"><button className="bg-purple-500 px-4 py-2 rounded-lg">Back</button></Link>
      <Link to="/login"><button className="border px-4 py-2 rounded-lg">Logout</button></Link>
    </div>
  </nav>
    <section className="bg-black text-white min-h-screen p-10">
    {/* <Navbar /> */}
    <h2 className="text-3xl font-bold text-center my-6">Image Detection</h2>
    <div className="flex flex-col items-center justify-center">
      <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" id="audioUpload" />
      <label htmlFor="audioUpload" className="bg-blue-500 px-6 py-3 rounded-lg text-white cursor-pointer">Choose Image File</label>
      {audioFile && (
        <audio controls className="mt-4">
          <source src={audioFile} type="audio/wav" />
          Your browser does not support the Image element.
        </audio>
      )}
    </div>
  </section>
  </div>
  )
}

export default ImageDetection