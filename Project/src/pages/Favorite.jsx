import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle' 
import { useAppContext } from '../context/AppContext'

const Favorite = () => {
const { favoriteMovies, image_base_url } = useAppContext()

console.log("Favorite movies:", favoriteMovies)
console.log("Image base URL:", image_base_url)

  // If no favorite movies, don't render anything (hide the page)
  if (favoriteMovies.length === 0) {
    return null;
  }

  return (
    <div className='relative px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden py-12 min-h-[80vh] pt-32'>
      <BlurCircle top='150px' left='0px' />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className='text-lg font-medium my-6 text-red-500'>My Favorite Movies</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {favoriteMovies.map((movie) => (
          <MovieCard movie={movie} key={movie._id || movie.id} />
        ))}
      </div>
    </div>
  );
}

export default Favorite
