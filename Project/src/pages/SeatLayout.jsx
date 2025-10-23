import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const SeatLayouts = () => {
  const groupRows = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J']];

  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();

  // Fetch show details
  useEffect(() => {
    const getShow = async () => {
      try {
        console.log('Fetching show for ID:', id);
        const { data } = await axios.get(`/api/show/${id}`);
        console.log('Show API response:', data);

        if (data.success) {
          setShow(data.show || data);
          console.log('Show data set successfully');
        } else {
          toast.error(data.message || 'Failed to fetch show details');
        }
      } catch (error) {
        console.error('Error fetching show:', error);
        toast.error('Failed to fetch show details');
      }
    };
    getShow();
  }, [id]);

  // Fetch occupied seats for selected time
  useEffect(() => {
    const getOccupiedSeats = async () => {
      if (!selectedTime?.showId) return;
      try {
        const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
        if (data.success) {
          setOccupiedSeats(data.occupiedSeats);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching occupied seats:', error);
      }
    };
    getOccupiedSeats();
  }, [selectedTime]);

  // Seat click handler
  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast('Please select a time first');
    if (occupiedSeats.includes(seatId)) return toast('This seat is already booked!');
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast('You can select up to 5 seats only');
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  // Render seats for a row
  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2 justify-center">
      {Array.from({ length: count }, (_, i) => {
        const seatId = `${row}${i + 1}`;
        const isOccupied = occupiedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        
        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            disabled={isOccupied}
            className={`h-8 w-8 rounded border text-xs transition
              ${isSelected ? 'bg-primary text-white border-primary' : ''}
              ${isOccupied ? 'bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed' : ''}
              ${!isOccupied && !isSelected ? 'border-primary/60 hover:bg-primary/20 cursor-pointer' : ''}`}
          >
            {seatId}
          </button>
        );
      })}
    </div>
  );

  // Booking tickets with detailed logging
  const bookTickets = async () => {
    try {
      if (!user) return toast.error('Please login to proceed');
      if (!selectedTime || selectedSeats.length === 0) return toast.error('Please select time and seats');

      const token = await getToken();

      console.log('Booking Request:', {
        showId: selectedTime.showId,
        selectedSeats,
        token,
      });

      const { data } = await axios.post(
        '/api/booking/create',
        { showId: selectedTime.showId, selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Booking Response:', data);

      if (data.success) {
        toast.success(data.message || 'Tickets booked successfully');
        navigate('/my-bookings');
      } else {
        toast.error(data.message || 'Failed to book tickets');
      }
    } catch (error) {
      console.error('Booking error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to book tickets';
      toast.error(`Booking failed: ${errorMessage}`);
    }
  };

  if (!show) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:pt-32 text-white">
      {/* Available Timings */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-6 h-max md:sticky md:top-10">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-4 space-y-1">
          {show.dateTime && show.dateTime[date] && show.dateTime[date].length > 0 ? (
            show.dateTime[date].map((item) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                  selectedTime?.time === item.time ? 'bg-primary text-white' : 'hover:bg-primary/20'
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <p className="text-sm">{isoTimeFormat(item.time)}</p>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              <p>No shows available for this date</p>
              <p className="text-xs mt-1">Selected date: {date}</p>
              <p className="text-xs">Available dates: {Object.keys(show.dateTime || {}).join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Seat Layout */}
      <div className="relative flex-1 flex flex-col items-center mt-10 md:mt-0">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className="text-2xl font-semibold mb-4">Select your Seat</h1>
        <div className="flex justify-center mb-8">
          <img src={assets.screenImage} alt="screen" className="w-full max-w-md" />
        </div>
        <p className="text-gray-300 text-sm mb-6">FACE HERE</p>

        {/* Legend */}
        <div className="flex gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-primary/60"></div>
            <span className="text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span className="text-gray-300">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-600 border-gray-500"></div>
            <span className="text-gray-300">Booked</span>
          </div>
        </div>

        {/* Show booked seats info */}
        {occupiedSeats.length > 0 && selectedTime && (
          <div className="mb-6 text-xs text-gray-400 bg-gray-800/50 px-4 py-2 rounded">
            <p>Booked seats: {occupiedSeats.join(', ')}</p>
          </div>
        )}

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          {/* First row group (A, B) */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-6 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>

          {/* Remaining rows (C–J) */}
          <div className="grid grid-cols-2 gap-8">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map((row) => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={bookTickets}
          className="flex items-center gap-2 mt-10 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Proceed To Checkout
          <ArrowRightIcon strokeWidth={3} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SeatLayouts;
