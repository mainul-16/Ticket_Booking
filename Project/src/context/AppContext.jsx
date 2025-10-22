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
      console.log("API Response:", data); // Debug log
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching shows:", error);
      toast.error("Failed to fetch shows");
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

  // ✅ Update favorite movies
  const updateFavorite = (movie) => {
    setFavoriteMovies(prev => {
      const isAlreadyFavorite = prev.some(m => m._id === movie._id || m.id === movie.id);
      if (isAlreadyFavorite) {
        return prev.filter(m => m._id !== movie._id && m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
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
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
