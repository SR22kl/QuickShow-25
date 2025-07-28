import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAdminStatus, setIsLoadingAdminStatus] = useState(true); // Tracks if admin status is being fetched
  const [show, setShow] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const user = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    setIsLoadingAdminStatus(true);
    try {
      const token = await getToken();
      if (!token) {
        // If no token, no need to check if user is admin or not
        setIsAdmin(false);
        return; // Exit early
      }

      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access the admin services");
      }
    } catch (error) {
      console.error("Error fetching admin status:", error);
      setIsAdmin(false); // Assume not admin on error
      // If the error is due to authorization, and on an admin path, redirect
      if (location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access the admin services");
      }
    } finally {
      setIsLoadingAdminStatus(false);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setShow(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchFavoriteMovies = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get("/api/user/favorites", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user.isSignedIn) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    } else {
      setIsAdmin(false);
      setIsLoadingAdminStatus(false); // User is not signed in, no need to check admin sataus
    }
  }, [user.isSignedIn]);

  const value = {
    axios,
    user,
    fetchIsAdmin,
    isAdmin,
    getToken,
    isLoadingAdminStatus,
    show,
    favoriteMovies,
    fetchFavoriteMovies,
    image_base_url,
  };

  return (
    <>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </>
  );
};

export const useAppContext = () => useContext(AppContext);
