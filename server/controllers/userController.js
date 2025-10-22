import Booking from "../models/Booking.js";
import { clerkClient } from "@clerk/express"; 
import Movie from "../models/Movie.js";

// API Controller Function to Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId; // fixed missing '='
    const bookings = await Booking.find({ user }).populate({
      path: "show",
      populate: { path: "movie" }
    }).sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
}


// API Controller Function to update Favorite Movie in Clerk User Metadata
export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    console.log("Updating favorite for user:", userId, "movie:", movieId);

    // Fetch the user from Clerk
    const user = await clerkClient.users.getUser(userId)

    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = []
    }

    console.log("Current favorites:", user.privateMetadata.favorites);

    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId)
      console.log("Added movie to favorites. New favorites:", user.privateMetadata.favorites);
    } else{
        user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId)
        console.log("Removed movie from favorites. New favorites:", user.privateMetadata.favorites);
    }

    await clerkClient.users.updateUserMetadata(userId, { privateMetadata: user.privateMetadata })

    res.json({ success: true, message: "Movie Favorites Updated" })
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
}

export const getFavorites = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId)
        const favorites = user.privateMetadata.favorites;

        console.log("Fetching favorites for user:", req.auth().userId);
        console.log("Favorites array:", favorites);

        // Getting movies from database
        const movies = await Movie.find({ _id: { $in: favorites } })
        console.log("Found movies:", movies.length);
        
        res.json({ success: true, movies })

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}