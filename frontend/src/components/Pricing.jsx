import React from 'react'

const Pricing = () => {
  return (
    <section className="text-center py-20 bg-black text-white w-full">
    <h2 className="text-3xl font-bold mb-6">Pricing</h2>
    <div className="grid grid-cols-3 gap-4 w-full px-10">
      <div className="border p-6 rounded-lg bg-gray-900">
        <h3 className="text-xl font-semibold">Basic</h3>
        <p>$9.99/mo - 100 analyses per month</p>
      </div>
      <div className="border p-6 rounded-lg bg-gray-900">
        <h3 className="text-xl font-semibold">Pro</h3>
        <p>$29.99/mo - 500 analyses per month</p>
      </div>
      <div className="border p-6 rounded-lg bg-gray-900">
        <h3 className="text-xl font-semibold">Enterprise</h3>
        <p>Custom - Unlimited analyses</p>
      </div>
    </div>
  </section>
  )
}

export default Pricing