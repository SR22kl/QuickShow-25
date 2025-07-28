import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../appContext/AppContext";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import Loader from "../../components/Loader";
import dateFormat from "../../lib/dateFormat";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, user, getToken } = useAppContext();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const { data } = await axios.get("/api/admin/all-shows", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setShows(data.shows);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error in fetching list of shows", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user]);

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
                  <td className="p-2">
                    {Object.keys(show?.occupiedSeats).length}
                  </td>
                  <td className="p-2">
                    {currency +
                      Object.keys(show?.occupiedSeats).length * show?.showPrice}
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
