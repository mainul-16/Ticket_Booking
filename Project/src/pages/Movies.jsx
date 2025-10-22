import React from 'react'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'

const Movies = () => {
  const { shows } = useAppContext()

  // Use API shows if available, otherwise fallback to dummy data
  const showsArray = Array.isArray(shows)
    ? shows
    : (shows?.shows || shows?.data?.shows || [])

  // Extract movies
  const movies = (Array.isArray(showsArray) && showsArray.length > 0 ? showsArray : dummyShowsData)
    .map(item => item.movie || item)
    .filter(movie => movie) // Remove null/undefined

  // Remove duplicates based on _id or id
  const uniqueMovies = Array.from(
    new Map(movies.map(movie => [movie._id || movie.id, movie])).values()
  )

  return (
    <div className="relative px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden py-12 min-h-[80vh] pt-32">
      {/* Background Blurs */}
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      {/* Foreground Content */}
      {uniqueMovies.length > 0 ? (
        <div className="relative z-10">
          <h1 className="text-lg font-medium my-6 text-red-500">New Releases</h1>
          <div className="flex flex-wrap max-sm:justify-center gap-8">
            {uniqueMovies.map((movie, index) => (
              <MovieCard
                key={movie._id || movie.id || index} // unique key
                movie={movie}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center h-screen items-center">
          <h1 className="text-3xl font-bold text-center">No Movies Available</h1>
        </div>
      )}
    </div>
  )
}

export default Movies
