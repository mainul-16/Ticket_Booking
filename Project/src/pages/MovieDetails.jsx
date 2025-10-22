import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import { HeartIcon, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'

const MovieDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [show, setShow] = useState(null)

  const { shows, axios, getToken, user, favoriteMovies, updateFavorite, image_base_url } = useAppContext()

  // Fetch single show by ID
  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success && data.show) {
        const apiShow = data.show
        const normalizedMovie = apiShow.movie || apiShow
        setShow({
          movie: normalizedMovie,
          dateTime: apiShow.dateTime || data.dateTime || []
        })
      } else {
        setShow(null)
      }
    } catch (error) {
      console.log(error)
      setShow(null)
    }
  }

  useEffect(() => {
    getShow()
  }, [id])

  if (!show || !show.movie) return (
    <div className="px-6 md:px-16 lg:px-40 pt-32 min-h-[60vh] flex items-center justify-center">
      <p className="text-gray-400">No movie data available.</p>
    </div>
  )

  const isFavorite = favoriteMovies.some(
    m => m._id === show.movie._id || m.id === show.movie.id
  )

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Please login to proceed")
      return
    }
    await updateFavorite(show.movie)  // add/remove favorite globally
    // Removed navigation - user stays on current page
  }

  // Get recommended movies (exclude current movie)
  const recommendedMovies = shows
    .map(item => item.movie || item)
    .filter(movie => movie._id !== show?.movie?._id)
    .slice(0, 4)

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-32">
      {/* Movie Info Section */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={`${image_base_url}${show.movie.poster_path}`}
          alt={`${show.movie.title} poster`}
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />
        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-primary">ENGLISH</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {show.movie.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {show.movie.vote_average.toFixed(1)} User Ratings
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie.overview || 'No overview available.'}
          </p>
          <p>
            {show.movie.runtime ? timeFormat(show.movie.runtime) : 'N/A'} •{" "}
            {Array.isArray(show.movie.genres) ? show.movie.genres.map(g => g.name).join(", ") : 'N/A'} •{" "}
            {show.movie.release_date ? show.movie.release_date.split("-")[0] : 'N/A'}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-800 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>
            <a
              href="#dateSelect"
              className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
            >
              Buy Tickets
            </a>
            <button
              onClick={handleFavoriteClick}
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
            >
              <HeartIcon
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <p className="text-lg font-medium mt-20 text-primary">Your Favorite Cast</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {Array.isArray(show.movie.casts) ? show.movie.casts.slice(0, 12).map((cast, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                src={cast.profile_path}
                alt={`${cast.name} profile`}
                className="rounded-full h-20 md:h-20 aspect-square object-cover"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          )) : null}
        </div>
      </div>

      {/* Date Select Section */}
      <DateSelect dateTime={show.dateTime} id={id} />

      {/* Recommendations */}
      {recommendedMovies.length > 0 && (
        <>
          <p className="text-lg font-medium mt-20 mb-8 text-red-500">You May Also Like</p>
          <div className="flex flex-wrap max-sm:justify-center gap-8">
            {recommendedMovies.map((movie) => (
              <MovieCard key={movie._id || movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

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

export default MovieDetails
