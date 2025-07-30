
const HeroSection = () => {
  return (
    <div className="mt-10 relative h-[70vh] w-[80%] mx-auto bg-gray-800 text-white rounded-xl" >
      <img
        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070"
        alt="Delicious pizza"
        className="absolute inset-0 w-full h-full object-cover opacity-60  rounded-xl"
      />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
        <h2 className="text-5xl font-extrabold mb-4">The Best Food, Delivered.</h2>
        <p className="text-xl mb-8">Quick and easy online ordering.</p>
        <button className="bg-[#ff5100] text-white font-bold py-3 px-8 rounded-full hover:bg-[#ff5100d5] transition-transform hover:scale-105">
          View Full Menu
        </button>
      </div>
    </div>
  )
}

export default HeroSection
