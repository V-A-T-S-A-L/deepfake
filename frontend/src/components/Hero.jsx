import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import HowItWorks from './HowItWorks'
import UploadSection from './UploadSection'
import Pricing from './Pricing'
import Footer from './Footer'

const Hero = () => {
  return (
    <div>
     <Navbar />
    <section className="text-center py-20 bg-black text-white w-full min-h-screen flex flex-col items-center justify-center">
    <h2 className="text-4xl font-bold">Detect DeepFakes with Confidence</h2>
    <p className="mt-4">Our cutting-edge AI technology helps you identify manipulated media with unparalleled accuracy.</p>
    <div className="mt-6 space-x-4">
      <Link to="/signup"><button className="bg-purple-500 px-6 py-3 rounded-lg">Get Started</button></Link>
    </div>
  </section>
  <HowItWorks/>
  <UploadSection/>
  <Pricing/>
  <Footer/>
  </div>
  

  )
}

export default Hero