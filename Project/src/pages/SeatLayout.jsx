import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const SeatLayouts = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)

  const navigate = useNavigate()

  const { axios, getToken, user } = useAppContext();

  // Debug the date parameter
  console.log("Date parameter from URL:", date);
  console.log("Date type:", typeof date);
  

  const getShow = async () => {
    try {
      console.log("Fetching show for ID:", id);
      const { data } = await axios.get(`/api/show/${id}`)
      console.log("Show API response:", data);
      
      if(data.success){
        setShow(data.show || data)
        console.log("Show data set successfully");
        console.log("Show data structure:", data.show);
        console.log("Available dates:", Object.keys(data.show?.dateTime || {}));
      } else {
        console.error("API returned error:", data.message);
        toast.error(data.message || "Failed to fetch show details");
      }
    } catch (error) {
      console.error("Error fetching show:", error);
      toast.error("Failed to fetch show details");
    }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a time first")
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can select up to 5 seats only")
    }
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : [...prev, seatId]
    )
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${
                selectedSeats.includes(seatId) ? "bg-primary text-white" : ""
              }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  )

  useEffect(() => {
    getShow()
  }, [])

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>

      {/* Available Timings */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {show.dateTime && show.dateTime[date] && show.dateTime[date].length > 0 ? (
            show.dateTime[date].map((item) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                  selectedTime?.time === item.time
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                <ClockIcon className='w-4 h-4' />
                <p className='text-sm'>{isoTimeFormat(item.time)}</p>
              </div>
            ))
          ) : (
            <div className='px-6 py-4 text-center text-gray-500'>
              <p>No shows available for this date</p>
              <p className='text-xs mt-1'>Selected date: {date}</p>
              <p className='text-xs'>Available dates: {Object.keys(show.dateTime || {}).join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Seat Layout */}
      <div className='relative flex-1 flex-col flex items-center max-md:mt-16'>
        <BlurCircle top='-100px' left='-100px' />
        <BlurCircle bottom='0' right='0' />
        <h1 className='text-2xl font-semibold mb-4 text-white'>Select your Seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-300 text-sm mb-6'>FACE HERE</p>

        {/* First row group (A, B) */}
        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>
 {/* Remaining rows (C–J) in 2 columns */}
        <div className='grid grid-cols-2 gap-11'>
          {groupRows.slice(1).map((group, idx) => (
            <div key={idx}>
              {group.map(row => renderSeats(row))}
            </div>
          ))}
        </div>
        </div>
        <button onClick={() => {
          if (!user) {
            toast.error("Please login to proceed with booking");
            return;
          }
          if (!selectedTime) {
            toast.error("Please select a time first");
            return;
          }
          if (selectedSeats.length === 0) {
            toast.error("Please select at least one seat");
            return;
          }
          navigate('/my-bookings');
        }}
        className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>Proceed To Checkout<ArrowRightIcon strokeWidth={3} className='h-4 w-4'/></button>
       
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayouts
