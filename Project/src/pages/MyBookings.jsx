import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import dateFormat from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const { axios, getToken, user, image_base_url } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [loading, setIsLoading] = useState(true)

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/user/bookings', {headers: { Authorization: `Bearer ${await getToken()}` }})
      if(data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if(user){
      getMyBookings()
    }
    
  }, [user])

  return !loading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-28 md:pt-40 min-h-[80vh]'>
      <BlurCircle top='100px' left='100px'/>
      <div><BlurCircle bottom='0px' left='600px'/></div>

      <h1 className='text-lg font-semibold mb-6 text-red-500'>My Bookings</h1>

      {bookings.map((item, index) => (
        <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/10 border border-primary/20 rounded-lg mt-6 p-4 max-w-3xl'>

          {/* Movie Info */}
          <div className='flex flex-col md:flex-row gap-4'>
            <img 
              src={image_base_url + item.show.movie.poster_path} 
              alt="poster" 
              className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded' 
            />
            <div className='flex flex-col justify-between'>
              <p className='text-lg font-semibold'>{item.show.movie.title}</p>
              <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
              <p className='text-gray-400 text-sm'>{dateFormat(item.show.showDateTime)}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className='flex flex-col md:items-end md:text-right justify-between mt-4 md:mt-0'>
            <div className='flex items-center gap-4'>
              <p className='text-2xl font-semibold text-gray-300'>{currency}{item.amount}</p>
              {!item.isPaid && (
                <button className='bg-primary px-4 py-1.5 text-sm rounded-full font-medium cursor-pointer'>
                  Pay Now
                </button>
              )}
            </div>

            <div className='text-sm mt-2 md:mt-4'>
              <p><span className='text-gray-400'>Total Tickets: </span>{item.bookedSeats.length}</p>
              <p><span className='text-gray-400'>Seat Numbers: </span>{item.bookedSeats.join(', ')}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : <Loading />
}

export default MyBookings
