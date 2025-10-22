import React, { useEffect, useState } from 'react'
import { CheckIcon, StarIcon, Trash2 as DeleteIcon } from 'lucide-react'
import { kConverter } from '../../lib/kConverter'
import { useAppContext } from '../../context/AppContext'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import toast from 'react-hot-toast'

const AddShows = () => {

  const { axios, getToken, user, image_base_url } = useAppContext()

  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [showPrice, setShowPrice] = useState('');
  const [addingShow, setAddingShow] = useState(false);

  // Fetch now playing movies
  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get('/api/show/now-playing', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  // Add datetime
  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });

    setDateTimeInput('');
  };

  // Remove selected time
  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    });
  };

  // Handle movie select/unselect
  const handleMovieSelect = (id) => {
    setSelectedMovie((prev) => (prev === id ? null : id));
  };

  // Submit add show
  const handleSubmit = async () => {
    try {
      setAddingShow(true);

      if (!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice) {
        toast.error('Missing required fields');
        return;
      }

      const showsInput = Object.entries(dateTimeSelection).map(([date, times]) => ({
        date,
        time: times
      }));

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice)
      };

      const { data } = await axios.post('/api/show/add', payload, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Submission Error:", error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setAddingShow(false);
    }
  };

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 text-lg font-medium text-primary">Now Playing Movies</p>

      {/* Horizontal Scrollable Movie List */}
      <div
        className="flex gap-4 mt-4 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-800 px-2 pb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {nowPlayingMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieSelect(movie.id)}
            className={`relative flex-shrink-0 cursor-pointer hover:-translate-y-1 transition duration-300 ${
              selectedMovie !== null && selectedMovie !== movie.id ? "opacity-40" : ""
            }`}
          >
            <div className="relative rounded-lg overflow-hidden h-60 w-40 shadow-md">
              <img
                src={image_base_url + movie.poster_path}
                alt={movie.title || 'Movie Poster'}
                className="h-full w-full object-cover object-center brightness-90"
              />
              <div className="text-xs flex items-center justify-between px-2 py-1 bg-black/70 w-full absolute bottom-0 left-0">
                <p className="flex items-center gap-1 text-gray-400">
                  <StarIcon className="w-3.5 h-3.5 text-primary fill-primary" />
                  {Number(movie.vote_average).toFixed(1)}
                </p>
                <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
              </div>
            </div>
            {selectedMovie === movie.id && (
              <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            )}
            <p className="font-medium mt-1 text-center break-words w-40">{movie.title}</p>
            <p className="text-gray-400 text-sm text-center">{movie.release_date}</p>
          </div>
        ))}
      </div>

      {/* Show Price Input */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2 text-primary">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400 text-sm">{currency}</p>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="outline-none bg-transparent text-white"
          />
        </div>
      </div>

      {/* Date and Time Input */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2 text-primary">Select Date and Time</label>
        <div className="inline-flex gap-5 border border-gray-600 p-2 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md text-white bg-transparent"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
          >
            Add Time
          </button>
        </div>
      </div>

      {/* Display Selected Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-primary font-semibold text-sm">Selected Date-Time</h2>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (
                    <div key={time} className="border border-primary px-2 py-1 flex items-center rounded">
                      <span>{time}</span>
                      <DeleteIcon
                        onClick={() => handleRemoveTime(date, time)}
                        width={15}
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={addingShow}
        className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-60"
      >
        {addingShow ? 'Adding...' : 'Add Shows'}
      </button>
    </>
  ) : (
    <Loading />
  );
};

export default AddShows;
