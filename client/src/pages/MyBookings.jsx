import { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loader from "../components/Loader";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import isoTimeFormat from "../lib/isoTimeFormat";
import dateFormat from "../lib/dateFormat";
import { useAppContext } from "../appContext/AppContext";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, user, getToken, image_base_url } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log(bookings)

  const getMyBookings = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const { data } = await axios.get("/api/user/bookings", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error in fetching list of bookings", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
  }, []);

  return !loading && bookings.length > 0 ? (
    <>
      <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh] mb-10">
        <BlurCircle top="100px" left="100px" />
        <div>
          <BlurCircle bottom="0px" left="600px" />
        </div>
        <h1 className="text-gray-300 font-semibold text-lg mb-4">
          My Bookings
        </h1>
        {bookings.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between bg-red-500/10 rounded-lg border border-red-500/20 mt-4 p-2 max-w-3xl"
          >
            {/* Right Side */}
            <div className="flex flex-col md:flex-row">
              <img
                src={image_base_url + item?.show?.movie?.poster_path}
                alt="poster"
                className="md:max-w-25 h-auto object-cover object-bottom rounded-lg"
              />
              <div className="flex flex-col p-4">
                <h1 className="text-gray-300 font-semibold text-lg">
                  {item?.show?.movie?.title || "NA"}
                </h1>
                <p className="text-gray-400 text-sm">
                  {timeFormat(item?.show?.movie?.runtime || "NA")}
                </p>
                <p className="text-gray-400 text-sm mt-auto">
                  {dateFormat(item?.show?.showDateTime || "NA")}
                </p>
              </div>
            </div>

            {/* Left Side */}
            <div className="flex flex-col md:items-end md:text-right justify-between p-4">
              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold mb-3">
                  {currency} {item?.amount || "NA"}
                </p>
                {!item.isPaid && (
                  <Link
                    to={item?.paymentLink || "#"}
                    className="bg-red-500 text-white px-4 py-2 mb-3 text-sm rounded-full font-medium active:scale-95"
                  >
                    Pay Now
                  </Link>
                )}
              </div>
              <div className="text-sm">
                <p className="text-green-400">
                  <span className="text-gray-200">Total Tickets: </span>
                  {item?.bookedSeats.length || "NA"}
                </p>
                <p className="text-indigo-300 mt-1">
                  <span className="text-gray-200">Seat No:&nbsp;</span>
                  {item?.bookedSeats.join(", ") || "NA"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="text-gray-300 font-semibold text-xl mb-4">My Bookings</h1>
      <p className="text-gray-400">No Bookings Found</p>
    </div>
  );
};

export default MyBookings;
