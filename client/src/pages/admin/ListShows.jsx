import { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loader from "../../components/Loader";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import dateFormat from "../../lib/dateFormat";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      setShows([
        {
          movie: dummyShowsData[0],
          showDateTime: "2025-06-30T02:30:00.000Z",
          showPrice: 59,
          occupiedSeats: {
            A1: "user_1",
            B1: "user_2",
            C1: "user_3",
          },
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllShows();
  }, []);

  return !loading ? (
    <>
      <div className="relative mt-10">
        <Title text1={"List of"} text2={"Shows"} />
        <BlurCircle top="0px" left="0px" />
        <div className="max-w-4xl mt-6 overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
            <thead>
              <tr className="bg-red-500/20 text-left text-white">
                <th className="p-2 font-medium pl-5">Movie Title</th>
                <th className="p-2">Show Time</th>
                <th className="p-2">Total Bookings</th>
                <th className="p-2">Eearnings</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show, index) => (
                <tr
                  key={index}
                  className="border-b border-red-500/20 text-left text-white bg-red-500/10"
                >
                  <td className="p-2 min-w-45 pl-5">{show?.movie?.title}</td>
                  <td className="p-2">{dateFormat(show?.showDateTime)}</td>
                  <td className="p-2">{Object.keys(show?.occupiedSeats).length}</td>
                  <td className="p-2">
                    {currency + Object.keys(show?.occupiedSeats).length * show?.showPrice}
                  </td>
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

export default ListShows;
