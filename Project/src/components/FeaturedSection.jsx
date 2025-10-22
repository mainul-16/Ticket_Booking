import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {
  const navigate = useNavigate()
  const { shows } = useAppContext()

  // Normalize shows from API/context
  const showsArray = Array.isArray(shows)
    ? shows
    : (shows?.shows || shows?.data?.shows || [])

  const displayShows = (showsArray || [])
    .slice(0, 4)
    .map(item => item.movie || item)

  return (
    <div className="relative px-4 md:px-10 lg:px-16 xl:px-20 overflow-hidden">
      {/* Header */}
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-80px" />
        <p className="text-lg font-medium text-red-500">Now Showing</p>
        <button
          onClick={() => navigate('/movies')}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
        >
          View All
          <ArrowRight className="group-hover:translate-x-0.5 transition w-4 h-4" />
        </button>
      </div>

      {/* Movies Grid */}
      <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8">
        {displayShows.map((movie) => (
          <MovieCard key={movie._id || movie.id} movie={movie} />
        ))}
      </div>

      {/* Show More Button */}
      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate('/movies')
            window.scrollTo(0, 0)
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show more
        </button>
      </div>
    </div>
  )
}

export default FeaturedSection
