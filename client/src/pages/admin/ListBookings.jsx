import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import Loader from "../../components/Loader";
import BlurCircle from "../../components/BlurCircle";
import { dummyBookingData } from "../../assets/assets";
import dateFormat from "../../lib/dateFormat";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      setBookings(dummyBookingData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(bookings);

  useEffect(() => {
    getAllBookings();
  }, []);
  return !loading ? (
    <>
      <div className="relative mt-10">
        <Title text1="List of" text2="Bookings" />
        <BlurCircle top="0px" left="0px" />
        <div className="max-w-4xl mt-6 overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
            <thead>
              <tr className="bg-red-500/20 text-left text-white">
                <th className="p-2 text-left pl-5">User Name</th>
                <th className="p-2 text-left pl-5">Movie Title</th>
                <th className="p-2 text-left">Show Time</th>
                <th className="p-2 text-left">Seats</th>
                <th className="p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="bg-red-500/10 text-left text-white">
                  <td className="p-2 min-w-45 pl-5">{booking.user.name}</td>
                  <td className="p-2">{booking?.show?.movie?.title}</td>
                  <td className="p-2">
                    {dateFormat(booking?.show?.showDateTime)}
                  </td>
                  <td className="p-2">
                    {Object.keys(booking.bookedSeats)
                      .map((seat) => booking.bookedSeats[seat])
                      .join(", ")}
                  </td>
                  <td className="p-2">{currency + booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  ) : (
    <>
      <Loader />
    </>
  );
};

export default ListBookings;
