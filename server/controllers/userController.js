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

    // Get current favorites or initialize empty array
    let favorites = user.privateMetadata.favorites || [];

    console.log("Current favorites:", favorites);

    // Check if movie is already in favorites
    const isAlreadyFavorite = favorites.includes(movieId);
    
    if (!isAlreadyFavorite) {
      // Add to favorites
      favorites.push(movieId);
      console.log("Added movie to favorites. New favorites:", favorites);
    } else {
      // Remove from favorites
      favorites = favorites.filter(item => item !== movieId);
      console.log("Removed movie from favorites. New favorites:", favorites);
    }

    // Update user metadata with new favorites array
    await clerkClient.users.updateUserMetadata(userId, { 
      privateMetadata: { 
        ...user.privateMetadata, 
        favorites: favorites 
      } 
    });

    console.log("Final favorites array after update:", favorites);
    res.json({ success: true, message: "Movie Favorites Updated", favorites: favorites })
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
}

export const getFavorites = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId)
        const favorites = user.privateMetadata.favorites || [];

        console.log("Fetching favorites for user:", req.auth().userId);
        console.log("Favorites array:", favorites);
        console.log("Favorites array length:", favorites.length);

        // Getting movies from database
        const movies = await Movie.find({ _id: { $in: favorites } })
        console.log("Found movies:", movies.length);
        console.log("Movie IDs found:", movies.map(m => m._id));
        
        res.json({ success: true, movies })

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}