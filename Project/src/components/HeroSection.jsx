import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import bgImage from '../assets/backgroundImage.png'  // 👈 import the image here

const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <div
      className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 bg-cover bg-center h-screen'
      style={{ backgroundImage: `url(${bgImage})` }}  // 👈 apply it inline
    >
      <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20" />

      <h1 className='text-5xl md:text-[70px] md:leading-[80px] font-semibold max-w-110 mb-2'>
        Guardian <br /> of the Galaxy
      </h1>

      <div className='flex items-center gap-4 text-gray-300'>
        <span>Action | Adventure | Sci-Fi</span>

        <div className='flex items-center gap-1'>
          <CalendarIcon className='w-4.5 h-4.5' /> 2018
        </div>
        <div className='flex items-center gap-1'>
          <ClockIcon className='w-4.5 h-4.5' /> 2h 8m
        </div>
      </div>

      <p className='max-w-md text-gray-300'>
        Guardians of the Galaxy follows a group of misfits—Star-Lord, Gamora, Drax, Rocket, and Groot—who come together to stop powerful cosmic threats. Despite their differences, they form a strong bond and become an unlikely family. The story blends humor, action, and emotion in a thrilling space adventure.
      </p>

      <button
        onClick={() => navigate('/Project/src/pages/Movies.jsx')}
        className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
      >
        Explore Movies
        <ArrowRight className='w-5 h-5' />
      </button>
    </div>
  )
}

export default HeroSection
