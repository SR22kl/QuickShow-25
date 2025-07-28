import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../appContext/AppContext";

const ProtectedFavoriteRoute = () => {
  const { favoriteMovies } = useAppContext();

  if (favoriteMovies?.length === 0) {
    return <Navigate to="/" replace />;
  }

  // If there are favorite movies, render the nested route content
  return <Outlet />;
};

export default ProtectedFavoriteRoute;
