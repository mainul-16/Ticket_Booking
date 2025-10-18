import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle' 
import { dummyShowsData } from '../assets/assets'

const Favorite = () => {
  return dummyShowsData.length > 0 ? (
    <div className='relative px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden py-12 min-h-[80vh]'>
      <BlurCircle top='150px' left='0px' />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className='text-lg font-medium my-6 text-red-500'>New Releases</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {dummyShowsData.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col justify-center h-screen items-center'>
      <h1 className='text-3xl font-bold text-center'>No Movies Available</h1>
    </div>
  );
}

export default Favorite
