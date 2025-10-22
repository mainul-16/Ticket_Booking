import axios from "axios";
import Movie from "../models/Movie.js"
import Show from "../models/Show.js"

// GET now playing movies
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing`,
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      }
    );
    res.json({ success: true, movies: data.results });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ADD new show
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, message: "movieId is required" });
    }

    // Check if movie exists
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch movie details and credits
      const [movieDetailsResponse, movieCreditResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditResponse.data;

      // Create movie in DB
      movie = await Movie.create({
        _id: movieId, // TMDB ID as MongoDB _id
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      });
    }

    // Prepare shows to insert
    const showsToCreate = [];

    showsInput.forEach((show) => {
      const showDate = show.date; // corrected
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`; // corrected
        showsToCreate.push({
          movie: movie._id, // corrected
          showDateTime: new Date(dateTimeString), // corrected
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Show Added Successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// API to get all shows in/from the database
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find().populate("movie");
    const uniqueShows = new Set(shows.map(show => show.movie))
    res.json({ success: true, count: shows.length, shows });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//Api single show
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Get movie details
    const movie = await Movie.findById(movieId).select(
      "title poster_path release_date overview vote_average runtime genres casts"
    );

    if (!movie) {
      return res.json({ success: false, message: "Movie not found" });
    }

    // Start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all upcoming shows for this movie
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: today }
    }).sort({ showDateTime: 1 });

    // Group shows by date
    const dateTime = {};

    shows.forEach(show => {
      const date = show.showDateTime.toISOString().split("T")[0]; // YYYY-MM-DD
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({
        time: show.showDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showId: show._id
      });
    });

    res.json({
      success: true,
      show: {
        movie,
        dateTime
      }
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};