import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Set base URL for API requests (fallback to localhost:3000)
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Check if user is admin
  const fetchIsAdmin = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin dashboard");
      }
    } catch (error) {
      console.log("Error checking admin status:", error);
    }
  };

  // ✅ Fetch all shows
  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setShows(data.shows || []);
      } else {
        toast.error(data.message || "Failed to fetch shows");
        setShows([]);
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
      toast.error("Failed to fetch shows");
      setShows([]);
    }
  };

  // ✅ Fetch favorite movies
  const fetchFavoritesMovies = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching favorites:", error);
    }
  };

  // ✅ Update favorite movies with toast messages
  const updateFavorite = async (movie) => {
    try {
      const token = await getToken();
      const movieId = movie._id || movie.id;

      // Check if movie is currently in favorites
      const isCurrentlyFavorite = favoriteMovies.some(
        m => m._id === movie._id || m.id === movie.id
      );

      // Call API to update favorites in database
      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        // Refresh favorites from server
        await fetchFavoritesMovies();

        // Show toast based on action
        if (isCurrentlyFavorite) {
          toast.error(`${movie.title || "Movie"} removed from favorites`);
        } else {
          toast.success(`${movie.title || "Movie"} added to favorites`);
        }
      } else {
        toast.error(data.message || "Failed to update favorites");
      }
    } catch (error) {
      console.log("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  // Load shows on mount
  useEffect(() => {
    fetchShows();
  }, []);

  // Load admin/favorites when user logs in
  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavoritesMovies();
    }
  }, [user]);

  const value = {
    axios,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchShows,
    fetchFavoritesMovies,
    fetchIsAdmin,
    updateFavorite,
    image_base_url
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
