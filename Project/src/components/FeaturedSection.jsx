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
    .filter(movie => movie) // Remove null/undefined movies

  return (
    <div className="relative px-4 md:px-10 lg:px-16 xl:px-20 overflow-hidden">
      {/* Header */}
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-80px" />
        <p className="text-lg font-medium text-red-500">Now Showing</p>
      </div>

      {/* Movies Grid */}
      <div className="flex flex-wrap justify-center gap-8 mt-8">
        {displayShows.length > 0 ? (
          displayShows.map((movie) => (
            <MovieCard key={movie._id || movie.id} movie={movie} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold text-center text-gray-400">No Movies Available</h2>
            <p className="text-gray-500 mt-2">Check back later for new releases!</p>
          </div>
        )}
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
