import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AddShows from "./pages/admin/AddShows";
import Dashboard from "./pages/admin/Dashboard";
import Layout from "./pages/admin/Layout";
import ListBookings from "./pages/admin/ListBookings";
import ListShows from "./pages/admin/ListShows";
import Favorite from "./pages/Favorite";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Movies from "./pages/Movies";
import MyBookings from "./pages/MyBookings";
import SeatLaylout from "./pages/SeatLaylout";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLaylout />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
