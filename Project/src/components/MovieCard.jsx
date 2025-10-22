import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()
  const { image_base_url } = useAppContext()

  // Fallbacks for missing data
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A'

  const genres = movie.genres?.length
    ? movie.genres.slice(0, 2).map(g => g.name).join(' | ')
    : 'N/A'

  const runtime = movie.runtime ? timeFormat(movie.runtime) : 'N/A'
  const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'

  const posterPath = movie.poster_path
    ? `${image_base_url}${movie.poster_path}`
    : 'https://via.placeholder.com/500x280?text=No+Image'

  console.log("MovieCard - image_base_url:", image_base_url)
  console.log("MovieCard - movie.poster_path:", movie.poster_path)
  console.log("MovieCard - final posterPath:", posterPath)

  const handleNavigate = () => {
    navigate(`/movies/${movie._id || movie.id}`)
    window.scrollTo(0, 0)
  }

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-64">
      <img
        onClick={handleNavigate}
        src={posterPath}
        alt={movie.title || 'Movie Poster'}
        className="rounded-lg h-52 w-full object-cover cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie.title || 'Untitled'}</p>

      <p className="text-sm text-gray-400 mt-2">
        {releaseYear} • {genres} • {runtime}
      </p>

      <div className="flex items-center justify-between mt-4 p-3">
        <button
          onClick={handleNavigate}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {voteAverage}
        </p>
      </div>
    </div>
  )
}

export default MovieCard
